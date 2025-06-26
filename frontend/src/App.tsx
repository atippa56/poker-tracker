import React, { useState } from 'react';
import './App.css';
import SessionForm from './components/SessionForm';
import SessionList from './components/SessionList';
import CumulativeProfitChart from './components/CumulativeProfitChart';
import PokerEquityCalculator from './components/PokerEquityCalculator';
import { useSessions } from './hooks/useSessions';
import ErrorBoundary from './components/ErrorBoundary';

type TabType = 'add' | 'view' | 'equity';

function App() {
  const { sessions, loading, error, createSession, updateSession, deleteSession } = useSessions();
  const [activeTab, setActiveTab] = useState<TabType>('add');

  return (
    <ErrorBoundary>
      <div className="container">
        <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: '900',
            background: 'linear-gradient(45deg, #ff0080, #00ffff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontFamily: 'Orbitron, monospace',
            textShadow: '0 0 30px rgba(255, 0, 128, 0.5)',
            letterSpacing: '2px',
            marginBottom: '1rem'
          }}>
            ⚡ CHIPFOLIO ⚡
          </h1>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.8)', 
            fontSize: '1.2rem',
            fontFamily: 'Rajdhani, monospace',
            fontWeight: '500',
            textShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
            letterSpacing: '1px'
          }}>
            &gt;&gt;&gt; BANKROLL TRACKING SYSTEM &lt;&lt;&lt;
          </p>
        </header>

        {error && (
          <div style={{ 
            backgroundColor: 'rgba(255, 0, 64, 0.1)', 
            border: '1px solid rgba(255, 0, 64, 0.5)', 
            color: '#ff0040',
            padding: '1rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            fontFamily: 'Rajdhani, monospace',
            fontWeight: '600',
            textShadow: '0 0 10px rgba(255, 0, 64, 0.5)',
            boxShadow: '0 0 20px rgba(255, 0, 64, 0.2)'
          }}>
            ⚠️ SYSTEM ERROR: {error}
          </div>
        )}

        {/* Navigation Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '3rem',
          borderBottom: '2px solid rgba(255, 0, 128, 0.3)',
          position: 'relative'
        }}>
          <div style={{
            display: 'flex',
            gap: '1rem',
            background: 'rgba(0, 0, 0, 0.5)',
            padding: '0.5rem',
            borderRadius: '12px 12px 0 0',
            border: '1px solid rgba(255, 0, 128, 0.3)',
            borderBottom: 'none'
          }}>
            <button
              onClick={() => setActiveTab('add')}
              className="nav-button"
              style={{
                padding: '1rem 2rem',
                background: activeTab === 'add' ? 
                  'linear-gradient(45deg, rgba(255, 0, 128, 0.3), rgba(128, 0, 255, 0.3))' : 
                  'linear-gradient(45deg, rgba(255, 0, 128, 0.1), rgba(128, 0, 255, 0.1))',
                color: 'white',
                border: '1px solid rgba(255, 0, 128, 0.3)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontFamily: 'Orbitron, monospace',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                transition: 'all 0.3s ease',
                boxShadow: activeTab === 'add' ? 
                  '0 0 30px rgba(255, 0, 128, 0.6)' : 
                  '0 0 10px rgba(255, 0, 128, 0.2)',
                textShadow: activeTab === 'add' ? 
                  '0 0 10px rgba(255, 255, 255, 0.8)' : 
                  '0 0 5px rgba(255, 255, 255, 0.3)'
              }}
            >
              🔧 REGISTER SESSION
            </button>
            <button
              onClick={() => setActiveTab('view')}
              className="nav-button"
              style={{
                padding: '1rem 2rem',
                background: activeTab === 'view' ? 
                  'linear-gradient(45deg, rgba(255, 0, 128, 0.3), rgba(128, 0, 255, 0.3))' : 
                  'linear-gradient(45deg, rgba(255, 0, 128, 0.1), rgba(128, 0, 255, 0.1))',
                color: 'white',
                border: '1px solid rgba(255, 0, 128, 0.3)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontFamily: 'Orbitron, monospace',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                transition: 'all 0.3s ease',
                boxShadow: activeTab === 'view' ? 
                  '0 0 30px rgba(255, 0, 128, 0.6)' : 
                  '0 0 10px rgba(255, 0, 128, 0.2)',
                textShadow: activeTab === 'view' ? 
                  '0 0 10px rgba(255, 255, 255, 0.8)' : 
                  '0 0 5px rgba(255, 255, 255, 0.3)'
              }}
            >
              📡 DATA MATRIX
            </button>
            <button
              onClick={() => setActiveTab('equity')}
              className="nav-button"
              style={{
                padding: '1rem 2rem',
                background: activeTab === 'equity' ? 
                  'linear-gradient(45deg, rgba(255, 0, 128, 0.3), rgba(128, 0, 255, 0.3))' : 
                  'linear-gradient(45deg, rgba(255, 0, 128, 0.1), rgba(128, 0, 255, 0.1))',
                color: 'white',
                border: '1px solid rgba(255, 0, 128, 0.3)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontFamily: 'Orbitron, monospace',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                transition: 'all 0.3s ease',
                boxShadow: activeTab === 'equity' ? 
                  '0 0 30px rgba(255, 0, 128, 0.6)' : 
                  '0 0 10px rgba(255, 0, 128, 0.2)',
                textShadow: activeTab === 'equity' ? 
                  '0 0 10px rgba(255, 255, 255, 0.8)' : 
                  '0 0 5px rgba(255, 255, 255, 0.3)'
              }}
            >
              🎯 EQUITY CALC
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'add' && (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <SessionForm onSubmit={createSession} />
          </div>
        )}

        {activeTab === 'view' && (
          <div>
            <SessionList 
              sessions={sessions} 
              onDelete={deleteSession}
              onUpdate={updateSession}
              loading={loading}
            />
            
            <div className="card" style={{ marginTop: '2rem' }}>
              <h2 style={{ 
                fontSize: '1.8rem', 
                fontWeight: '700', 
                marginBottom: '1.5rem',
                fontFamily: 'Orbitron, monospace',
                color: '#ffffff',
                textShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                textAlign: 'center'
              }}>
                📈 CUMULATIVE GRAPH
              </h2>
              <CumulativeProfitChart sessions={sessions} />
            </div>
          </div>
        )}

        {activeTab === 'equity' && (
          <div>
            <PokerEquityCalculator />
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
