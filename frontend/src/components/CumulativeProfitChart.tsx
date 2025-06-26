import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Session } from '../types/session';

interface CumulativeProfitChartProps {
  sessions: Session[];
}

const CumulativeProfitChart: React.FC<CumulativeProfitChartProps> = ({ sessions }) => {
  // Sort sessions by date and calculate cumulative profit
  const sortedSessions = [...sessions].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const chartData = sortedSessions.reduce((acc, session, index) => {
    const cumulativeProfit = index === 0 
      ? session.net_profit
      : acc[index - 1].cumulativeProfit + session.net_profit;

    acc.push({
      date: new Date(session.date).toLocaleDateString(),
      session: index + 1,
      sessionProfit: session.net_profit,
      cumulativeProfit: cumulativeProfit,
      location: session.location,
      stakes: `$${session.sb_size.toFixed(2)}/$${session.bb_size.toFixed(2)}`
    });

    return acc;
  }, [] as any[]);

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ 
          background: 'rgba(0, 0, 0, 0.9)', 
          padding: '0.75rem', 
          border: '1px solid rgba(0, 255, 0, 0.5)',
          borderRadius: '8px',
          boxShadow: '0 0 20px rgba(0, 255, 0, 0.3)',
          color: '#ffffff',
          fontFamily: 'Rajdhani, monospace'
        }}>
          <p style={{ fontWeight: '700', marginBottom: '0.5rem', color: '#00ff00', textShadow: '0 0 5px #00ff00' }}>
            {`Session ${data.session} - ${data.date}`}
          </p>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.25rem' }}>{`${data.location} (${data.stakes})`}</p>
          <p style={{ color: data.sessionProfit >= 0 ? '#00ffff' : '#ff0040', textShadow: `0 0 5px ${data.sessionProfit >= 0 ? '#00ffff' : '#ff0040'}`, marginBottom: '0.25rem' }}>
            {`Session Profit: $${data.sessionProfit > 0 ? '+' : ''}${data.sessionProfit.toFixed(2)}`}
          </p>
          <p style={{ color: data.cumulativeProfit >= 0 ? '#00ffff' : '#ff0040', textShadow: `0 0 5px ${data.cumulativeProfit >= 0 ? '#00ffff' : '#ff0040'}`, fontWeight: '700' }}>
            {`Cumulative: $${data.cumulativeProfit > 0 ? '+' : ''}${data.cumulativeProfit.toFixed(2)}`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (sessions.length === 0) {
    return (
      <div className="chart-container" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '8px'
      }}>
        <div className="text-center" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#00ff00', textShadow: '0 0 5px #00ff00' }}>No data to display</div>
          <div style={{ fontSize: '0.875rem', marginTop: '0.5rem', fontFamily: 'Rajdhani, monospace' }}>
            Add some poker sessions to see your cumulative profit chart
          </div>
        </div>
      </div>
    );
  }

  const finalProfit = chartData[chartData.length - 1]?.cumulativeProfit || 0;

  return (
    <div>
      {/* Summary Stats */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginBottom: '1rem',
        padding: '1rem',
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '8px',
        border: '1px solid rgba(0, 255, 0, 0.3)',
        boxShadow: '0 0 10px rgba(0, 255, 0, 0.1)'
      }}>
        <div className="text-center">
          <div style={{ fontSize: '0.875rem', color: '#00ff00', textShadow: '0 0 5px #00ff00', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Sessions</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#00ff00', textShadow: '0 0 10px #00ff00' }}>{sessions.length}</div>
        </div>
        <div className="text-center">
          <div style={{ fontSize: '0.875rem', color: '#00ff00', textShadow: '0 0 5px #00ff00', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Profit</div>
          <div style={{ 
            fontSize: '1.5rem', 
            fontWeight: '700'
          }} className={finalProfit >= 0 ? 'text-green' : 'text-red'}>
            ${finalProfit > 0 ? '+' : ''}{finalProfit.toFixed(2)}
          </div>
        </div>
        <div className="text-center">
          <div style={{ fontSize: '0.875rem', color: '#00ff00', textShadow: '0 0 5px #00ff00', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Avg per Session</div>
          <div style={{ 
            fontSize: '1.5rem', 
            fontWeight: '700'
          }} className={(finalProfit / sessions.length) >= 0 ? 'text-green' : 'text-red'}>
            ${(finalProfit / sessions.length).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 255, 0, 0.2)" />
            <XAxis 
              dataKey="session" 
              stroke="rgba(255, 255, 255, 0.6)"
              fontSize={12}
              tickFormatter={(value) => `#${value}`}
            />
            <YAxis 
              stroke="rgba(255, 255, 255, 0.6)"
              fontSize={12}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={customTooltip} />
            <ReferenceLine y={0} stroke="rgba(255, 0, 128, 0.6)" strokeDasharray="2 2" />
            <Line 
              type="monotone" 
              dataKey="cumulativeProfit" 
              stroke="#00ffff" 
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, stroke: '#00ffff', strokeWidth: 2, fill: '#00ffff', filter: 'drop-shadow(0 0 6px #00ffff)' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CumulativeProfitChart; 