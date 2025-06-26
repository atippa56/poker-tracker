from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session as DBSession
from typing import List
from ..database.database import get_db
from ..models.session import Session
from ..schemas import SessionCreate, SessionResponse, SessionUpdate

router = APIRouter(
    prefix="/sessions",
    tags=["sessions"],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=SessionResponse, status_code=status.HTTP_201_CREATED)
def create_session(session_data: SessionCreate, db: DBSession = Depends(get_db)):
    """Create a new poker session"""
    try:
        # Create new session instance
        db_session = Session(
            date=session_data.date,
            location=session_data.location,
            sb_size=session_data.sb_size,
            bb_size=session_data.bb_size,
            buy_in=session_data.buy_in,
            cash_out=session_data.cash_out,
            hours=session_data.hours,
            notes=session_data.notes
        )
        
        # Add to database
        db.add(db_session)
        db.commit()
        db.refresh(db_session)
        
        return db_session
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error creating session: {str(e)}"
        )

@router.get("/", response_model=List[SessionResponse])
def get_sessions(skip: int = 0, limit: int = 100, db: DBSession = Depends(get_db)):
    """Get all poker sessions with pagination"""
    sessions = db.query(Session).offset(skip).limit(limit).all()
    return sessions

@router.get("/{session_id}", response_model=SessionResponse)
def get_session(session_id: int, db: DBSession = Depends(get_db)):
    """Get a specific session by ID"""
    session = db.query(Session).filter(Session.id == session_id).first()
    if session is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Session with id {session_id} not found"
        )
    return session

@router.put("/{session_id}", response_model=SessionResponse)
def update_session(
    session_id: int, 
    session_data: SessionUpdate, 
    db: DBSession = Depends(get_db)
):
    """Update a specific session"""
    session = db.query(Session).filter(Session.id == session_id).first()
    if session is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Session with id {session_id} not found"
        )
    
    # Update only provided fields
    update_data = session_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(session, field, value)
    
    try:
        db.commit()
        db.refresh(session)
        return session
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error updating session: {str(e)}"
        )

@router.delete("/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_session(session_id: int, db: DBSession = Depends(get_db)):
    """Delete a specific session"""
    session = db.query(Session).filter(Session.id == session_id).first()
    if session is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Session with id {session_id} not found"
        )
    
    try:
        db.delete(session)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error deleting session: {str(e)}"
        ) 