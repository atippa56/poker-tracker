# CHIPFOLIO - Poker Bankroll Tracker

A modern poker session tracking application with real-time analytics and equity calculations.

## Features

- **Session Tracking**: Log poker sessions with buy-ins, cash-outs, and detailed notes
- **Real-time Analytics**: BB/hour calculations and cumulative profit tracking
- **Interactive Charts**: Visualize your poker journey with responsive charts
- **Equity Calculator**: Built-in poker hand equity calculator
- **Cyberpunk Theme**: Modern black/pink/green neon design

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Backend**: FastAPI + SQLAlchemy
- **Database**: SQLite
- **Charts**: Recharts
- **Deployment**: Vercel

## Local Development

### Prerequisites
- Node.js 16+ 
- Python 3.9+

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Backend Setup
```bash
cd backend
pip install -r ../requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

## Deployment

This project is configured for one-click Vercel deployment:

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the configuration
3. Deploy with zero additional setup

## API Endpoints

- `GET /sessions/` - Get all sessions
- `POST /sessions/` - Create new session
- `GET /sessions/{id}` - Get specific session
- `PUT /sessions/{id}` - Update session
- `DELETE /sessions/{id}` - Delete session
- `GET /health` - Health check

## License

MIT License 