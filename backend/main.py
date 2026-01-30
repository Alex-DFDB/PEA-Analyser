from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import yfinance as yf
from typing import List
import pandas as pd
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TickerRequest(BaseModel):
    tickers: List[str]

def normalize_ticker(ticker: str) -> str:
    ticker = ticker.upper().strip()
    if '.' in ticker:
        return ticker
    return f"{ticker}.BE"

def calculate_avg_dividend_yield(stock, current_price: float) -> float:
    """Calcule le rendement moyen des dividendes sur 5 ans basé sur le prix actuel"""
    try:
        dividends = stock.dividends
        if dividends.empty:
            return 0.0
        
        five_years_ago = pd.Timestamp.now(tz=dividends.index.tz) - pd.DateOffset(years=5)
        recent_dividends = dividends[dividends.index >= five_years_ago]
        
        if recent_dividends.empty:
            return 0.0
        
        avg_annual_dividend = recent_dividends.mean()
        
        dividend_yield = (avg_annual_dividend / current_price) * 100
        
        return round(dividend_yield, 2)
    except:
        return 0.0

@app.get("/api/quote/{ticker}")
async def get_quote(ticker: str):
    try:
        normalized_ticker = normalize_ticker(ticker)
        stock = yf.Ticker(normalized_ticker)
        hist = stock.history(period="5d")
        
        if hist.empty:
            raise HTTPException(status_code=404, detail=f"Ticker {ticker} introuvable")
        
        current_price = hist['Close'].iloc[-1]
        info = stock.info
        dividend_yield = calculate_avg_dividend_yield(stock, current_price)
        
        return {
            "ticker": ticker.upper(),
            "currentPrice": float(current_price),
            "dividendYield": dividend_yield,
            "name": info.get('longName', info.get('shortName', ticker))
        }
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Erreur: {str(e)}")

@app.post("/api/quotes")
async def get_quotes(request: TickerRequest):
    results = []
    for ticker in request.tickers:
        try:
            normalized_ticker = normalize_ticker(ticker)
            stock = yf.Ticker(normalized_ticker)
            hist = stock.history(period="5d")
            
            if not hist.empty:
                current_price = hist['Close'].iloc[-1]
                info = stock.info
                dividend_yield = calculate_avg_dividend_yield(stock, current_price)
                
                results.append({
                    "ticker": ticker.upper(),
                    "currentPrice": float(current_price),
                    "dividendYield": dividend_yield,
                    "name": info.get('longName', info.get('shortName', ticker))
                })
            else:
                results.append({
                    "ticker": ticker.upper(),
                    "currentPrice": None,
                    "dividendYield": 0,
                    "error": "Ticker introuvable"
                })
        except Exception as e:
            results.append({
                "ticker": ticker.upper(),
                "currentPrice": None,
                "dividendYield": 0,
                "error": str(e)
            })
    
    return results

@app.post("/api/historical")
async def get_historical(request: TickerRequest):
    results = []
    for ticker in request.tickers:
        try:
            normalized_ticker = normalize_ticker(ticker)
            stock = yf.Ticker(normalized_ticker)
            hist = stock.history(period="5y", interval="1mo")
            
            if not hist.empty:
                historical_data = [
                    {
                        "Date": date.strftime("%Y-%m-%d"),
                        "Close": float(row['Close'])
                    }
                    for date, row in hist.iterrows()
                ]
                
                results.append({
                    "ticker": ticker.upper(),
                    "historical": historical_data
                })
            else:
                results.append({
                    "ticker": ticker.upper(),
                    "historical": [],
                    "error": "Pas de données historiques"
                })
        except Exception as e:
            results.append({
                "ticker": ticker.upper(),
                "historical": [],
                "error": str(e)
            })
    
    return results

@app.post("/api/dividends")
async def get_dividends(request: TickerRequest):
    """
    Récupère l'historique des paiements de dividendes des 10 dernières années
    pour chaque ticker fourni.
    
    Retourne pour chaque ticker:
    - Liste des paiements avec date, montant et rendement (%)
    """
    results = []
    
    for ticker in request.tickers:
        try:
            normalized_ticker = normalize_ticker(ticker)
            stock = yf.Ticker(normalized_ticker)
            
            # Récupérer les dividendes
            dividends = stock.dividends
            
            if dividends.empty:
                results.append({
                    "ticker": ticker.upper(),
                    "dividends": [],
                    "error": "Pas de dividendes"
                })
                continue
            
            # Créer le timestamp avec la même timezone que les dividendes
            if dividends.index.tz is not None:
                ten_years_ago = pd.Timestamp.now(tz=dividends.index.tz) - pd.DateOffset(years=10)
            else:
                ten_years_ago = pd.Timestamp.now() - pd.DateOffset(years=10)
                ten_years_ago = ten_years_ago.tz_localize(None)
            
            # Filtrer les 10 dernières années
            recent_dividends = dividends[dividends.index >= ten_years_ago]
            
            if recent_dividends.empty:
                results.append({
                    "ticker": ticker.upper(),
                    "dividends": [],
                    "error": "Pas de dividendes sur cette période"
                })
                continue
            
            # Récupérer l'historique des prix pour calculer le rendement
            # On récupère depuis 10 ans avec des données quotidiennes
            hist = stock.history(period="10y", interval="1d")
            
            # Convertir en liste de paiements avec calcul du rendement
            dividend_payments = []
            for date, amount in recent_dividends.items():
                payment = {
                    "date": date.strftime("%Y-%m-%d"),
                    "amount": float(amount)
                }
                
                # Trouver le prix de l'action à la date du dividende
                try:
                    # Chercher le prix le plus proche de la date du dividende
                    payment_date = pd.Timestamp(date).tz_localize(None) if date.tz else date
                    
                    # Trouver l'index le plus proche dans l'historique
                    if not hist.empty:
                        hist_dates = hist.index.tz_localize(None) if hist.index.tz else hist.index
                        closest_idx = hist_dates.searchsorted(payment_date)
                        
                        # Prendre la date la plus proche (avant ou après)
                        if closest_idx >= len(hist):
                            closest_idx = len(hist) - 1
                        elif closest_idx > 0:
                            # Choisir entre avant et après
                            before = hist_dates[closest_idx - 1]
                            after = hist_dates[closest_idx]
                            if abs((payment_date - before).days) < abs((payment_date - after).days):
                                closest_idx = closest_idx - 1
                        
                        price_at_payment = float(hist['Close'].iloc[closest_idx])
                        
                        # Calculer le rendement en %
                        yield_percent = (float(amount) / price_at_payment) * 100
                        payment["yield"] = round(yield_percent, 2)
                        payment["priceAtPayment"] = round(price_at_payment, 2)
                    else:
                        payment["yield"] = None
                        payment["priceAtPayment"] = None
                        
                except Exception as e:
                    print(f"Erreur calcul rendement pour {ticker} à {date}: {e}")
                    payment["yield"] = None
                    payment["priceAtPayment"] = None
                
                dividend_payments.append(payment)
            
            results.append({
                "ticker": ticker.upper(),
                "dividends": dividend_payments
            })
            
        except Exception as e:
            results.append({
                "ticker": ticker.upper(),
                "dividends": [],
                "error": str(e)
            })
    
    return results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)