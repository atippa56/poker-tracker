import React, { useState, useCallback, useRef } from 'react';
import { Session, SessionCreate } from '../types/session';

interface SessionListProps {
  sessions: Session[];
  onDelete: (id: number) => Promise<void>;
  onUpdate: (id: number, data: Partial<SessionCreate>) => Promise<Session>;
  loading?: boolean;
}

const SessionList: React.FC<SessionListProps> = ({ sessions, onDelete, onUpdate, loading }) => {
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [editedNotes, setEditedNotes] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        await onDelete(id);
      } catch (error) {
        alert('Failed to delete session. Please try again.');
      }
    }
  };

  const handleShowNotes = (session: Session) => {
    setSelectedSession(session);
    setEditedNotes(session.notes || '');
    setIsEditing(false);
    setIsSaving(false);
    setShowNotesModal(true);
  };

  const handleCloseNotes = () => {
    setShowNotesModal(false);
    setSelectedSession(null);
    setEditedNotes('');
    setIsEditing(false);
    setIsSaving(false);
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
  };

  const saveNotes = useCallback(async (notesToSave: string) => {
    if (!selectedSession || notesToSave === selectedSession.notes) {
      return; // No changes to save
    }
    
    setIsSaving(true);
    try {
      await onUpdate(selectedSession.id, { notes: notesToSave });
      // Update the selected session with new notes
      setSelectedSession(prev => prev ? { ...prev, notes: notesToSave } : null);
    } catch (error) {
      console.error('Failed to save notes:', error);
      // Revert to original notes on error
      setEditedNotes(selectedSession.notes || '');
    } finally {
      setIsSaving(false);
    }
  }, [selectedSession, onUpdate]);

  const handleNotesChange = useCallback((newNotes: string) => {
    setEditedNotes(newNotes);
    
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Set new timeout for auto-save
    saveTimeoutRef.current = setTimeout(() => {
      saveNotes(newNotes);
    }, 1000); // Auto-save after 1 second of inactivity
  }, [saveNotes]);

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // Save immediately when switching out of edit mode
      saveNotes(editedNotes);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
          Sessions
        </h2>
        <div className="text-center">Loading sessions...</div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
        Sessions ({sessions.length})
      </h2>

      {sessions.length === 0 ? (
        <div className="text-center" style={{ color: '#6b7280', padding: '2rem' }}>
          No sessions yet. Add your first session to get started!
        </div>
      ) : (
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Location</th>
                <th>SB/BB</th>
                <th>Buy-in</th>
                <th>Cash Out</th>
                <th>Profit</th>
                <th>BB/hour</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.id}>
                  <td>
                    {new Date(session.date).toLocaleDateString()}
                  </td>
                  <td>{session.location}</td>
                  <td>${session.sb_size.toFixed(2)}/${session.bb_size.toFixed(2)}</td>
                  <td>${session.buy_in.toFixed(2)}</td>
                  <td>${session.cash_out.toFixed(2)}</td>
                  <td>
                    <span className={session.net_profit >= 0 ? 'text-green' : 'text-red'}>
                      ${session.net_profit > 0 ? '+' : ''}{session.net_profit.toFixed(2)}
                    </span>
                  </td>
                  <td>
                    <span className={session.bb_per_hour >= 0 ? 'text-green' : 'text-red'}>
                      {session.bb_per_hour > 0 ? '+' : ''}{session.bb_per_hour.toFixed(1)} BB/h
                    </span>
                  </td>
                  <td>
                    {session.notes && session.notes.trim() ? (
                      <button
                        onClick={() => handleShowNotes(session)}
                        className="btn btn-primary"
                        style={{ fontSize: '0.875rem', padding: '0.5rem 1rem', marginRight: '0.5rem' }}
                        title="View session notes"
                      >
                        📝 Notes
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.5)' }}>No notes</span>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(session.id)}
                      className="btn btn-danger"
                      style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {sessions.length > 0 && (
        <div style={{ 
          marginTop: '0.75rem', 
          padding: '0.5rem 0.75rem', 
          background: 'rgba(0, 0, 0, 0.3)', 
          borderRadius: '8px',
          border: '1px solid rgba(0, 255, 0, 0.3)',
          boxShadow: '0 0 10px rgba(0, 255, 0, 0.1)'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '0.75rem', color: '#00ff00', marginBottom: '0.125rem', textShadow: '0 0 5px #00ff00', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Sessions</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#00ff00', textShadow: '0 0 10px #00ff00' }}>{sessions.length}</div>
            </div>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '0.75rem', color: '#00ff00', marginBottom: '0.125rem', textShadow: '0 0 5px #00ff00', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Profit</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '700' }}>
                <span className={sessions.reduce((sum, s) => sum + s.net_profit, 0) >= 0 ? 'text-green' : 'text-red'}>
                  ${sessions.reduce((sum, s) => sum + s.net_profit, 0).toFixed(2)}
                </span>
              </div>
            </div>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '0.75rem', color: '#00ff00', marginBottom: '0.125rem', textShadow: '0 0 5px #00ff00', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Avg Per Session</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '700' }}>
                <span className={sessions.reduce((sum, s) => sum + s.net_profit, 0) / sessions.length >= 0 ? 'text-green' : 'text-red'}>
                  ${(sessions.reduce((sum, s) => sum + s.net_profit, 0) / sessions.length).toFixed(2)}
                </span>
              </div>
            </div>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '0.75rem', color: '#00ff00', marginBottom: '0.125rem', textShadow: '0 0 5px #00ff00', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Avg BB/hour</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '700' }}>
                <span className={sessions.reduce((sum, s) => sum + s.bb_per_hour, 0) / sessions.length >= 0 ? 'text-green' : 'text-red'}>
                  {sessions.length > 0 ? (sessions.reduce((sum, s) => sum + s.bb_per_hour, 0) / sessions.length).toFixed(1) : '0.0'} BB/h
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notes Modal */}
      {showNotesModal && selectedSession && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'rgba(17, 17, 17, 0.95)',
            border: '1px solid rgba(255, 0, 128, 0.3)',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
            boxShadow: '0 0 40px rgba(255, 0, 128, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            color: '#ffffff',
            fontFamily: 'Rajdhani, monospace'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              borderBottom: '1px solid rgba(255, 0, 128, 0.3)',
              paddingBottom: '1rem'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: '#00ff00', textShadow: '0 0 10px #00ff00', fontFamily: 'Orbitron, monospace', textTransform: 'uppercase', letterSpacing: '1px' }}>
                📝 Session Notes {isSaving && <span style={{ fontSize: '0.875rem', color: '#00ffff', textShadow: '0 0 5px #00ffff' }}>(Saving...)</span>}
              </h3>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button
                  onClick={toggleEditMode}
                  className="btn btn-primary"
                  style={{
                    background: isEditing ? 'linear-gradient(45deg, rgba(255, 0, 128, 0.3), rgba(128, 0, 255, 0.3))' : 'linear-gradient(45deg, rgba(255, 0, 128, 0.1), rgba(128, 0, 255, 0.1))',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 0, 128, 0.3)',
                    borderRadius: '6px',
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    fontFamily: 'Orbitron, monospace',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    boxShadow: isEditing ? '0 0 20px rgba(255, 0, 128, 0.4)' : '0 0 10px rgba(255, 0, 128, 0.2)'
                  }}
                  title={isEditing ? "Stop editing" : "Edit notes"}
                >
                  {isEditing ? '✓ Done' : '✏️ Edit'}
                </button>
                <button
                  onClick={handleCloseNotes}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: 'rgba(255, 255, 255, 0.7)',
                    transition: 'color 0.3s ease'
                  }}
                  title="Close"
                  onMouseEnter={(e) => (e.target as HTMLButtonElement).style.color = '#ff0040'}
                  onMouseLeave={(e) => (e.target as HTMLButtonElement).style.color = 'rgba(255, 255, 255, 0.7)'}
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.875rem', color: '#00ff00', marginBottom: '0.5rem', textShadow: '0 0 5px #00ff00', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
                <strong>Session Details:</strong>
              </div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', fontFamily: 'Rajdhani, monospace' }}>
                {new Date(selectedSession.date).toLocaleDateString()} • {selectedSession.location} • 
                ${selectedSession.sb_size.toFixed(2)}/${selectedSession.bb_size.toFixed(2)} • 
                {selectedSession.hours} hours
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.875rem', color: '#00ff00', marginBottom: '0.5rem', textShadow: '0 0 5px #00ff00', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
                <strong>Notes:</strong>
              </div>
              {isEditing ? (
                <textarea
                  value={editedNotes}
                  onChange={(e) => handleNotesChange(e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: '200px',
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(255, 0, 128, 0.3)',
                    borderRadius: '8px',
                    padding: '1rem',
                    fontSize: '0.875rem',
                    lineHeight: '1.5',
                    color: '#ffffff',
                    fontFamily: 'Rajdhani, monospace',
                    resize: 'vertical',
                    outline: 'none',
                    boxShadow: '0 0 20px rgba(255, 0, 128, 0.1)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(255, 0, 128, 0.6)';
                    e.target.style.boxShadow = '0 0 20px rgba(255, 0, 128, 0.4)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 0, 128, 0.3)';
                    e.target.style.boxShadow = '0 0 20px rgba(255, 0, 128, 0.1)';
                  }}
                  placeholder="Add your session notes here..."
                />
              ) : (
                <div style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 0, 128, 0.2)',
                  borderRadius: '8px',
                  padding: '1rem',
                  minHeight: '100px',
                  whiteSpace: 'pre-wrap',
                  fontSize: '0.875rem',
                  lineHeight: '1.5',
                  color: 'rgba(255, 255, 255, 0.9)',
                  cursor: 'pointer',
                  fontFamily: 'Rajdhani, monospace',
                  transition: 'all 0.3s ease'
                }}
                onClick={toggleEditMode}
                title="Click to edit notes"
                                 onMouseEnter={(e) => {
                   (e.target as HTMLDivElement).style.borderColor = 'rgba(255, 0, 128, 0.4)';
                   (e.target as HTMLDivElement).style.background = 'rgba(0, 0, 0, 0.5)';
                 }}
                 onMouseLeave={(e) => {
                   (e.target as HTMLDivElement).style.borderColor = 'rgba(255, 0, 128, 0.2)';
                   (e.target as HTMLDivElement).style.background = 'rgba(0, 0, 0, 0.3)';
                 }}
                >
                  {editedNotes || 'No notes available for this session. Click to add notes.'}
                </div>
              )}
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '0.5rem', textAlign: 'left', fontFamily: 'Rajdhani, monospace' }}>
                💡 Tip: Click the "✓ Done" button to save your changes
              </div>
              <button
                onClick={handleCloseNotes}
                className="btn btn-primary"
                style={{ padding: '0.75rem 1.5rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionList; 