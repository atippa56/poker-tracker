// In-memory storage for demo (resets on each deployment)
let sessions = [
  {
    id: 1,
    date: "2024-01-15",
    location: "Local Casino",
    sb_size: 1,
    bb_size: 2,
    buy_in: 200,
    cash_out: 350,
    net_profit: 150,
    bb_per_hour: 12.5
  },
  {
    id: 2,
    date: "2024-01-16", 
    location: "Online",
    sb_size: 0.5,
    bb_size: 1,
    buy_in: 100,
    cash_out: 80,
    net_profit: -20,
    bb_per_hour: -4.2
  },
  {
    id: 3,
    date: "2024-01-17",
    location: "Local Casino",
    sb_size: 2,
    bb_size: 5,
    buy_in: 500,
    cash_out: 750,
    net_profit: 250,
    bb_per_hour: 8.3
  }
];

let nextId = 4;

export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Root API endpoint
  if (req.url === '/api/' || req.url === '/api') {
    res.status(200).json({ 
      message: "CHIPFOLIO Poker Tracker API", 
      status: "Demo version with in-memory storage",
      note: "Data resets on each deployment. For persistent storage, run FastAPI backend locally.",
      endpoints: {
        "GET /api/sessions/": "List all sessions",
        "POST /api/sessions/": "Create new session", 
        "DELETE /api/sessions/{id}": "Delete session by ID"
      }
    });
    return;
  }

  // Handle sessions endpoints - normalize URL by removing trailing slash for comparison
  const normalizedUrl = req.url?.replace(/\/$/, '');
  
  if (normalizedUrl?.startsWith('/api/sessions') || req.url?.startsWith('/api/sessions')) {
    
    // GET /api/sessions/ - List all sessions  
    if (req.method === 'GET' && (req.url === '/api/sessions' || req.url === '/api/sessions/')) {
      res.status(200).json(sessions);
      return;
    }
    
    // POST /api/sessions/ - Create new session
    if (req.method === 'POST' && (req.url === '/api/sessions' || req.url === '/api/sessions/')) {
      try {
        const body = req.body;
        
        // Calculate net profit and BB/hour
        const netProfit = (body.cash_out || 0) - (body.buy_in || 0);
        const bbPerHour = body.bb_size > 0 ? (netProfit / body.bb_size) : 0;
        
        const newSession = {
          id: nextId++,
          date: body.date || new Date().toISOString().split('T')[0],
          location: body.location || "Unknown",
          sb_size: parseFloat(body.sb_size) || 0,
          bb_size: parseFloat(body.bb_size) || 0,
          buy_in: parseFloat(body.buy_in) || 0,
          cash_out: parseFloat(body.cash_out) || 0,
          net_profit: netProfit,
          bb_per_hour: parseFloat(bbPerHour.toFixed(2))
        };
        
        sessions.push(newSession);
        res.status(201).json(newSession);
        return;
      } catch (error) {
        res.status(400).json({ error: "Invalid request body" });
        return;
      }
    }
    
    // DELETE /api/sessions/{id} - Delete session by ID
    if (req.method === 'DELETE' && (normalizedUrl?.match(/^\/api\/sessions\/\d+$/) || req.url?.match(/^\/api\/sessions\/\d+$/))) {
      const sessionId = parseInt(req.url.split('/').pop());
      const sessionIndex = sessions.findIndex(s => s.id === sessionId);
      
      if (sessionIndex === -1) {
        res.status(404).json({ error: "Session not found" });
        return;
      }
      
      sessions.splice(sessionIndex, 1);
      res.status(204).end();
      return;
    }
  }

  // Health check endpoint for frontend
  if (req.url === '/api/health') {
    res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
    return;
  }

  // Default response
  res.status(404).json({ error: "Endpoint not found", url: req.url, method: req.method });
}
