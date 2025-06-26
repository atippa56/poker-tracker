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

  // For now, return a message indicating backend is not deployed
  if (req.url === '/api/' || req.url === '/api') {
    res.status(200).json({ 
      message: "CHIPFOLIO Poker Tracker API", 
      status: "Backend not deployed - frontend only demo",
      note: "To use full functionality, run the FastAPI backend locally on port 8000"
    });
    return;
  }

  // Handle sessions endpoint
  if (req.url?.startsWith('/api/sessions')) {
    if (req.method === 'GET') {
      // Return sample data for demo
      res.status(200).json([
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
        }
      ]);
      return;
    }
    
    if (req.method === 'POST') {
      res.status(501).json({ 
        error: "POST not implemented in demo", 
        message: "Run the FastAPI backend locally for full functionality" 
      });
      return;
    }
  }

  // Default response
  res.status(404).json({ error: "Endpoint not found" });
}
