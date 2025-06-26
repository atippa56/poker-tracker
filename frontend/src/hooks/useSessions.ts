import { useState, useEffect, useCallback } from 'react';
import { Session, SessionCreate } from '../types/session';
import { apiService } from '../services/api';

interface UseSessionsReturn {
  sessions: Session[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createSession: (data: SessionCreate) => Promise<Session>;
  updateSession: (id: number, data: Partial<SessionCreate>) => Promise<Session>;
  deleteSession: (id: number) => Promise<void>;
}

export const useSessions = (): UseSessionsReturn => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getSessions();
      setSessions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sessions');
    } finally {
      setLoading(false);
    }
  }, []);

  const createSession = useCallback(async (sessionData: SessionCreate): Promise<Session> => {
    try {
      setError(null);
      const newSession = await apiService.createSession(sessionData);
      setSessions(prev => [...prev, newSession]);
      return newSession;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create session';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const updateSession = useCallback(async (id: number, sessionData: Partial<SessionCreate>): Promise<Session> => {
    try {
      setError(null);
      const updatedSession = await apiService.updateSession(id, sessionData);
      setSessions(prev => prev.map(session => 
        session.id === id ? updatedSession : session
      ));
      return updatedSession;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update session';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const deleteSession = useCallback(async (id: number): Promise<void> => {
    try {
      setError(null);
      await apiService.deleteSession(id);
      setSessions(prev => prev.filter(session => session.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete session';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return {
    sessions,
    loading,
    error,
    refetch: fetchSessions,
    createSession,
    updateSession,
    deleteSession,
  };
}; 