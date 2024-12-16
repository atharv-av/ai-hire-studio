import { useState, useEffect, useCallback, useRef } from 'react';

interface TimerHookReturn {
  timeLeft: number;
  startTimer: () => void;
  resetTimer: () => void;
  hasStarted: boolean;
}

export const useTimer = (seconds: number, onTimeUp?: () => Promise<void>): TimerHookReturn => {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasStartedRef = useRef(false);

  const clearCurrentInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    // Only start if not already running
    if (hasStartedRef.current) return;
    
    hasStartedRef.current = true;
    setTimeLeft(seconds);

    intervalRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearCurrentInterval();
          // Only call onTimeUp if the timer actually started and completed
          if (hasStartedRef.current) {
            onTimeUp?.();
          }
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  }, [seconds, onTimeUp, clearCurrentInterval]);

  const resetTimer = useCallback(() => {
    clearCurrentInterval();
    hasStartedRef.current = false;
    setTimeLeft(seconds);
  }, [seconds, clearCurrentInterval]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearCurrentInterval();
    };
  }, [clearCurrentInterval]);

  return {
    timeLeft,
    startTimer,
    resetTimer,
    hasStarted: hasStartedRef.current
  };
};
