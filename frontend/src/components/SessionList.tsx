import React from 'react';
import { Session, SessionCreate } from '../types/session';

interface SessionListProps {
  sessions: Session[];
  onDelete: (id: number) => Promise<void>;
  onUpdate: (id: number, data: Partial<SessionCreate>) => Promise<Session>;
  loading?: boolean;
}

const SessionList: React.FC<SessionListProps> = ({ sessions, onDelete, onUpdate, loading }) => {
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        await onDelete(id);
      } catch (error) {
        alert('Failed to delete session. Please try again.');
      }
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
    </div>
  );
};

export default SessionList; 