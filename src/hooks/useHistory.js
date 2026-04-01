import { useState, useCallback } from 'react';

const STORAGE_KEY = 'focusflow_history';

/**
 * Validates and sanitizes a session object from localStorage
 * Prevents XSS by ensuring expected types and structure
 */
function validateSession(session) {
  if (
    typeof session.id === 'number' &&
    typeof session.task === 'string' &&
    typeof session.duration === 'number' &&
    typeof session.date === 'string' &&
    session.id > 0 &&
    session.duration > 0 &&
    session.task.length > 0 &&
    session.task.length <= 1000
  ) {
    // Sanitize: remove any HTML-like content from task
    return {
      id: session.id,
      task: String(session.task).replace(/<[^>]*>/g, ''), // strip HTML tags
      duration: Math.floor(session.duration),
      date: String(session.date).slice(0, 30), // limit length
    };
  }
  return null;
}

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    
    // Validate each session before returning
    return parsed
      .map(validateSession)
      .filter(s => s !== null);
  } catch (error) {
    // Silent fail on parse errors - built-in recovery
    console.warn('Failed to load history:', error.message);
    return [];
  }
}

function saveHistory(history) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    // Differentiate quota errors from other failures
    if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
      console.error('Storage quota exceeded. Consider clearing old sessions.');
      // In a real app, you'd emit this to UI for user notification
    } else if (error.name === 'SecurityError') {
      console.error('Storage access denied. Running in private/incognito mode?');
    } else {
      console.error('Failed to save history:', error.message);
    }
  }
}

/**
 * Custom hook for managing focus session history with localStorage persistence
 * @returns {Object} { history: Session[], addSession, clearHistory, deleteSession }
 */
export function useHistory() {
  const [history, setHistory] = useState(loadHistory);

  /**
   * Add a new completed session to history
   * @param {string} task - Task name/description
   * @param {number} durationSeconds - Duration in seconds
   * @returns {Object} The created session object
   */
  const addSession = useCallback((task, durationSeconds) => {
    const session = {
      id: Date.now() + Math.random(), // Slightly collision-resistant
      task: String(task).trim().slice(0, 1000), // Sanitize: trim & limit length
      duration: Math.max(0, Math.floor(durationSeconds)), // Ensure positive integer
      date: new Date().toISOString(),
    };
    setHistory(prev => {
      const next = [session, ...prev];
      saveHistory(next);
      return next;
    });
    return session;
  }, []);

  /**
   * Clear all history and remove from storage
   */
  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  /**
   * Delete a single session by ID
   * @param {number} id - Session ID to delete
   */
  const deleteSession = useCallback((id) => {
    setHistory(prev => {
      const next = prev.filter(s => s.id !== id);
      saveHistory(next);
      return next;
    });
  }, []);

  return { history, addSession, clearHistory, deleteSession };
}
