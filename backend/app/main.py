from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from .database.database import create_tables
from .routers import sessions

app = FastAPI(
    title="Bankroll Tracker API",
    description="A poker bankroll tracking application API",
    version="1.0.0"
)

# Configure CORS for frontend integration
# In production, you should replace "*" with your specific frontend URL
origins = [
    "http://localhost:3000",  # React dev server
    "http://localhost:3001",  # Alternative React dev port
]

# Add production origins
if os.getenv("ENVIRONMENT") == "production":
    # Add your Vercel domain here after deployment
    origins.extend([
        "https://your-app.vercel.app",  # Replace with your actual Vercel URL
        # Add custom domains here
    ])

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(sessions.router)

# Create database tables on startup
@app.on_event("startup")
async def startup_event():
    create_tables()

@app.get("/")
async def root():
    return {"message": "Bankroll Tracker API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"} 