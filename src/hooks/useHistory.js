import { useState, useCallback } from 'react';

const STORAGE_KEY = 'focusflow_history';

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(history) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch { /* quota exceeded or SSR */ }
}

export function useHistory() {
  const [history, setHistory] = useState(loadHistory);

  const addSession = useCallback((task, durationSeconds) => {
    const session = {
      id: Date.now(),
      task: task.trim(),
      duration: durationSeconds, // in seconds
      date: new Date().toISOString(),
    };
    setHistory(prev => {
      const next = [session, ...prev];
      saveHistory(next);
      return next;
    });
    return session;
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const deleteSession = useCallback((id) => {
    setHistory(prev => {
      const next = prev.filter(s => s.id !== id);
      saveHistory(next);
      return next;
    });
  }, []);

  return { history, addSession, clearHistory, deleteSession };
}
