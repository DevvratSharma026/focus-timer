import { useState, useEffect, useRef, useCallback } from 'react';

export function useTimer() {
  const [elapsed, setElapsed] = useState(0); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const accumulatedRef = useRef(0);

  const start = useCallback(() => {
    if (isRunning) return;
    startTimeRef.current = Date.now();
    setIsRunning(true);
  }, [isRunning]);

  const stop = useCallback(() => {
    if (!isRunning) return;
    accumulatedRef.current += Math.floor((Date.now() - startTimeRef.current) / 1000);
    setIsRunning(false);
    return accumulatedRef.current;
  }, [isRunning]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setElapsed(0);
    accumulatedRef.current = 0;
    startTimeRef.current = null;
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        const live = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setElapsed(accumulatedRef.current + live);
      }, 500);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  return { elapsed, isRunning, start, stop, reset };
}
