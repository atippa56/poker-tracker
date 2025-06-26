export interface Session {
  id: number;
  date: string;
  location: string;
  sb_size: number;
  bb_size: number;
  buy_in: number;
  cash_out: number;
  hours: number;
  notes?: string;
  net_profit: number;
  bb_per_hour: number;
  created_at: string;
  updated_at: string;
}

export interface SessionCreate {
  date: string;
  location: string;
  sb_size: number;
  bb_size: number;
  buy_in: number;
  cash_out: number;
  hours: number;
  notes?: string;
}

export interface ChartDataPoint {
  date: string;
  cumulative_profit: number;
  session_profit: number;
  session_id: number;
}

export interface SessionFormData {
  date: string;
  location: string;
  sb_size: string;
  bb_size: string;
  buy_in: string;
  cash_out: string;
  hours: string;
  notes: string;
} 