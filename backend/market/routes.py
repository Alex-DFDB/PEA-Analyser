"""
Market data API routes (stock quotes, dividends, historical data).
"""
from fastapi import APIRouter, HTTPException
import yfinance as yf
import pandas as pd
import logging
from market.schemas import TickerRequest


# Configure logging
logger = logging.getLogger(__name__)

# Constants
BELGIAN_EXCHANGE_SUFFIX = ".BE"
DEFAULT_HISTORY_PERIOD = "5d"
FIVE_YEAR_PERIOD = "5y"
TEN_YEAR_PERIOD = "10y"
MONTHLY_INTERVAL = "1mo"
DAILY_INTERVAL = "1d"

router = APIRouter(prefix="/api", tags=["Market Data"])


def normalize_ticker(ticker: str) -> str:
    """
    Normalize ticker symbol by adding Belgian exchange suffix if not present.

    Args:
        ticker: Stock ticker symbol

    Returns:
        Normalized ticker with exchange suffix
    """
    ticker = ticker.upper().strip()
    if '.' in ticker:
        return ticker
    return f"{ticker}{BELGIAN_EXCHANGE_SUFFIX}"


def calculate_avg_dividend_yield(stock: yf.Ticker, current_price: float) -> float:
    """
    Calculate the average dividend yield over the last 5 years based on current price.

    Args:
        stock: yfinance Ticker object
        current_price: Current stock price

    Returns:
        Average dividend yield as a percentage
    """
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
    except Exception as e:
        logger.warning(f"Error calculating dividend yield: {str(e)}")
        return 0.0


@router.get("/quote/{ticker}")
async def get_quote(ticker: str):
    """
    Get current quote information for a single ticker.

    Args:
        ticker: Stock ticker symbol

    Returns:
        Quote information including current price, dividend yield, and company name

    Raises:
        HTTPException: If ticker is not found or data cannot be retrieved
    """
    try:
        normalized_ticker = normalize_ticker(ticker)
        stock = yf.Ticker(normalized_ticker)
        hist = stock.history(period=DEFAULT_HISTORY_PERIOD)

        if hist.empty:
            raise HTTPException(
                status_code=404,
                detail=f"Ticker {ticker} not found or no data available"
            )

        current_price = hist['Close'].iloc[-1]
        info = stock.info
        dividend_yield = calculate_avg_dividend_yield(stock, current_price)

        return {
            "ticker": ticker.upper(),
            "currentPrice": float(current_price),
            "dividendYield": dividend_yield,
            "name": info.get('longName', info.get('shortName', ticker))
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching quote for {ticker}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@router.post("/quotes")
async def get_quotes(request: TickerRequest):
    """
    Get current quote information for multiple tickers.

    Args:
        request: Request containing list of ticker symbols

    Returns:
        List of quote information for each ticker
    """
    results = []
    for ticker in request.tickers:
        try:
            normalized_ticker = normalize_ticker(ticker)
            stock = yf.Ticker(normalized_ticker)
            hist = stock.history(period=DEFAULT_HISTORY_PERIOD)

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
                    "error": "Ticker not found"
                })
        except Exception as e:
            logger.error(f"Error fetching quote for {ticker}: {str(e)}")
            results.append({
                "ticker": ticker.upper(),
                "currentPrice": None,
                "dividendYield": 0,
                "error": str(e)
            })

    return results


@router.post("/historical")
async def get_historical(request: TickerRequest):
    """
    Get historical price data for multiple tickers.

    Args:
        request: Request containing list of ticker symbols

    Returns:
        List of historical price data (5 years, monthly) for each ticker
    """
    results = []
    for ticker in request.tickers:
        try:
            normalized_ticker = normalize_ticker(ticker)
            stock = yf.Ticker(normalized_ticker)
            hist = stock.history(period=FIVE_YEAR_PERIOD, interval=MONTHLY_INTERVAL)

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
                    "error": "No historical data available"
                })
        except Exception as e:
            logger.error(f"Error fetching historical data for {ticker}: {str(e)}")
            results.append({
                "ticker": ticker.upper(),
                "historical": [],
                "error": str(e)
            })

    return results


def _find_closest_price(hist: pd.DataFrame, payment_date: pd.Timestamp) -> tuple[float, float]:
    """
    Find the closest stock price to a given payment date.

    Args:
        hist: Historical price data DataFrame
        payment_date: Date of dividend payment

    Returns:
        Tuple of (price_at_payment, yield_percent) or (None, None) if not found
    """
    if hist.empty:
        return None, None

    try:
        # Normalize timezone
        payment_date_normalized = payment_date.tz_localize(None) if payment_date.tz else payment_date
        hist_dates = hist.index.tz_localize(None) if hist.index.tz else hist.index

        # Find the closest index
        closest_idx = hist_dates.searchsorted(payment_date_normalized)

        # Take the closest date (before or after)
        if closest_idx >= len(hist):
            closest_idx = len(hist) - 1
        elif closest_idx > 0:
            # Choose between before and after
            before = hist_dates[closest_idx - 1]
            after = hist_dates[closest_idx]
            if abs((payment_date_normalized - before).days) < abs((payment_date_normalized - after).days):
                closest_idx = closest_idx - 1

        price_at_payment = float(hist['Close'].iloc[closest_idx])
        return price_at_payment, None
    except Exception as e:
        logger.warning(f"Error finding closest price: {str(e)}")
        return None, None


@router.post("/dividends")
async def get_dividends(request: TickerRequest):
    """
    Get dividend payment history for the last 10 years for each ticker.

    Args:
        request: Request containing list of ticker symbols

    Returns:
        List of dividend payments with date, amount, and yield (%) for each ticker
    """
    results = []

    for ticker in request.tickers:
        try:
            normalized_ticker = normalize_ticker(ticker)
            stock = yf.Ticker(normalized_ticker)

            # Get dividend data
            dividends = stock.dividends

            if dividends.empty:
                results.append({
                    "ticker": ticker.upper(),
                    "dividends": [],
                    "error": "No dividends available"
                })
                continue

            # Create timestamp with the same timezone as dividends
            if dividends.index.tz is not None:
                ten_years_ago = pd.Timestamp.now(tz=dividends.index.tz) - pd.DateOffset(years=10)
            else:
                ten_years_ago = pd.Timestamp.now() - pd.DateOffset(years=10)
                ten_years_ago = ten_years_ago.tz_localize(None)

            # Filter last 10 years
            recent_dividends = dividends[dividends.index >= ten_years_ago]

            if recent_dividends.empty:
                results.append({
                    "ticker": ticker.upper(),
                    "dividends": [],
                    "error": "No dividends in this period"
                })
                continue

            # Get price history to calculate yield (10 years of daily data)
            hist = stock.history(period=TEN_YEAR_PERIOD, interval=DAILY_INTERVAL)

            # Convert to payment list with yield calculation
            dividend_payments = []
            for date, amount in recent_dividends.items():
                payment = {
                    "date": date.strftime("%Y-%m-%d"),
                    "amount": float(amount)
                }

                # Find stock price at dividend date
                price_at_payment, _ = _find_closest_price(hist, date)

                if price_at_payment is not None:
                    # Calculate yield percentage
                    yield_percent = (float(amount) / price_at_payment) * 100
                    payment["yield"] = round(yield_percent, 2)
                    payment["priceAtPayment"] = round(price_at_payment, 2)
                else:
                    payment["yield"] = None
                    payment["priceAtPayment"] = None

                dividend_payments.append(payment)

            results.append({
                "ticker": ticker.upper(),
                "dividends": dividend_payments
            })

        except Exception as e:
            logger.error(f"Error fetching dividends for {ticker}: {str(e)}")
            results.append({
                "ticker": ticker.upper(),
                "dividends": [],
                "error": str(e)
            })

    return results
