import React, { useState } from 'react';
import { SessionCreate } from '../types/session';

interface SessionFormProps {
  onSubmit: (data: SessionCreate) => Promise<any>;
  loading?: boolean;
  onCancel?: () => void;
}

const SessionForm: React.FC<SessionFormProps> = ({ onSubmit, loading, onCancel }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0], // Today's date
    location: '',
    sb_size: '',
    bb_size: '',
    buy_in: '',
    cash_out: '',
    hours: '',
    notes: ''
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Convert string inputs to numbers and format date for API
    const submitData: SessionCreate = {
      date: formData.date + 'T12:00:00', // Convert date to datetime format
      location: formData.location,
      sb_size: parseFloat(formData.sb_size) || 0,
      bb_size: parseFloat(formData.bb_size) || 0,
      buy_in: parseFloat(formData.buy_in) || 0,
      cash_out: parseFloat(formData.cash_out) || 0,
      hours: parseFloat(formData.hours) || 0,
      notes: formData.notes
    };

    try {
      await onSubmit(submitData);
      // Reset form on success
      setFormData({
        date: new Date().toISOString().split('T')[0],
        location: '',
        sb_size: '',
        bb_size: '',
        buy_in: '',
        cash_out: '',
        hours: '',
        notes: ''
      });
    } catch (err) {
      console.error('Session creation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create session');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="card">
      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
        Add New Session
      </h2>

      {error && (
        <div style={{ 
          backgroundColor: '#fef2f2', 
          border: '1px solid #fecaca', 
          color: '#b91c1c',
          padding: '0.75rem',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2">
          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., MGM Las Vegas"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Small Blind ($)</label>
            <input
              type="number"
              name="sb_size"
              value={formData.sb_size}
              onChange={handleChange}
              className="form-input"
              step="0.01"
              min="0"
              placeholder="e.g., 1"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Big Blind ($)</label>
            <input
              type="number"
              name="bb_size"
              value={formData.bb_size}
              onChange={handleChange}
              className="form-input"
              step="0.01"
              min="0"
              placeholder="e.g., 2"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Buy-in ($)</label>
            <input
              type="number"
              name="buy_in"
              value={formData.buy_in}
              onChange={handleChange}
              className="form-input"
              step="0.01"
              min="0"
              placeholder="e.g., 200"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Cash Out ($)</label>
            <input
              type="number"
              name="cash_out"
              value={formData.cash_out}
              onChange={handleChange}
              className="form-input"
              step="0.01"
              min="0"
              placeholder="e.g., 350"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Hours Played</label>
            <input
              type="number"
              name="hours"
              value={formData.hours}
              onChange={handleChange}
              className="form-input"
              step="0.25"
              min="0"
              placeholder="e.g., 4.5"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="form-input"
            rows={3}
            placeholder="Optional notes about the session..."
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn"
              style={{ backgroundColor: '#6b7280', color: 'white' }}
            >
              Cancel
            </button>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Adding...' : 'Add Session'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SessionForm; 