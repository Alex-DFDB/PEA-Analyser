# PEA Tracker

Outil de suivi et projection de portefeuille boursier (PEA - Plan d'Épargne en Actions).

## 📋 Description

PEA Tracker permet de :

- **Suivre** vos positions en temps réel (cours, plus/moins-values)
- **Visualiser** la répartition de votre portefeuille et la performance historique
- **Projeter** la croissance future basée sur l'historique 5 ans avec/sans réinvestissement des dividendes

## 🛠️ Stack Technique

- **Frontend** : React 19 + TypeScript + Vite + Tailwind CSS
- **Backend** : FastAPI (Python)
- **Graphiques** : Recharts
- **API financière** : yfinance

## 🚀 Installation

### Prérequis

- Node.js 20+
- Python 3.8+

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend

# Créer le fichier de configuration
cp .env.example .env

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'app sera accessible sur `http://localhost:5173`

## 📖 Utilisation

### Ajouter une position

1. Cliquer sur "Ajouter"
2. Saisir : ticker (ex: BYNN pour Rubis), quantité, prix d'achat
3. Le cours actuel et dividende moyen 5 ans sont récupérés automatiquement

### Importer plusieurs positions

Format JSON :

```json
[
    {
        "ticker": "BYNN",
        "name": "Rubis",
        "quantity": 70,
        "buyPrice": 28.22,
        "color": "#ef4444"
    }
]
```

Utiliser le bouton "Importer JSON"

### Actualiser les données

- Bouton "Actualiser" : met à jour les cours et charge l'historique 5 ans
- Nécessaire pour les projections et graphiques

### Projections

- Basées sur le CAGR (taux de croissance annuel composé) historique 5 ans
- **Vue totale** : comparaison avec/sans réinvestissement dividendes
- **Vue détaillée** : projection par ticker

## 📊 Fonctionnalités

- ✅ Résumé : valeur totale, investi, +/- value
- 📈 Graphique performance historique 5 ans
- 🥧 Répartition du portefeuille
- 📋 Tableau des positions avec dividendes moyens
- 🔮 Projections de croissance personnalisables

## ⚙️ Configuration

### Variables d'environnement

#### Backend

- Port par défaut : `8000`
- CORS : autorisé pour toutes origines (à restreindre en production)

#### Frontend (frontend/.env)

Créez un fichier `.env` à partir de `.env.example` :

```bash
cp .env.example .env
```

Variables disponibles :

```bash
VITE_API_URL=http://localhost:8000
```

- `VITE_API_URL` : URL du backend (défaut : `http://localhost:8000`)

**Important** : Redémarrez le serveur de développement (`npm run dev`) après modification du `.env`

### Modifier l'URL du backend

Pour pointer vers un backend distant :

```bash
# frontend/.env
VITE_API_URL=https://api.monserveur.com
```

## 📝 Notes

- Les tickers doivent être au format Euronext Bruxelles (suffixe `.BE` ajouté automatiquement)
- Les données sont stockées en mémoire (pas de persistence)
- Le rendement des dividendes est calculé sur la moyenne 5 ans au prix actuel

## 🤝 Contribution

Projet personnel. Fork et PR bienvenues !

## 📄 Licence

MIT
