import { useRef } from 'react';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';
import { formatTime } from '../utils';

export default function TimerPanel({ onSessionComplete, timerState, task, setTask, activeTask, setActiveTask }) {
  const { elapsed, isRunning, start, pause, stop, reset } = timerState;
  const inputRef = useRef(null);

  const handleStart = () => {
    if (!task.trim()) {
      inputRef.current?.focus();
      return;
    }
    setActiveTask(task.trim());
    start();
  };

  const handleStop = () => {
    const duration = stop();
    if (duration > 0) {
      onSessionComplete(activeTask, duration);
    }
    reset();
    setTask('');
    setActiveTask('');
  };

  const handlePause = () => {
    pause();
  };

  const handleReset = () => {
    reset();
    setTask('');
    setActiveTask('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isRunning) handleStart();
  };

  return (
    <div className="flex flex-col items-center gap-10 py-4">

      {/* Timer Display */}
      <div className="text-center">
        <div
          className={`timer-display text-[7rem] leading-none select-none transition-colors duration-500 ${
            isRunning ? 'text-[#00ff87] running-glow' : elapsed > 0 ? 'text-[#00ff87]/60' : 'text-[#1e1e1e]'
          }`}
        >
          {formatTime(elapsed)}
        </div>
        {isRunning && (
          <div className="mt-3 flex items-center justify-center gap-2 slide-up">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff87] animate-pulse" />
            <span className="font-mono text-xs tracking-widest text-[#666] uppercase">
              {activeTask}
            </span>
          </div>
        )}
      </div>

      {/* Task Input */}
      {!isRunning && (
        <div className="w-full max-w-sm slide-up">
          <label className="block font-mono text-[10px] tracking-[0.2em] text-[#444] uppercase mb-3">
            Task Label
          </label>
          <input
            ref={inputRef}
            className="task-input"
            type="text"
            value={task}
            onChange={e => setTask(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. Deep work on COSMOS..."
            maxLength={60}
            disabled={isRunning}
            autoFocus
          />
          {task.trim() === '' && (
            <p className="mt-2 font-mono text-[10px] text-[#333] tracking-wider">
              Enter a task name to begin
            </p>
          )}
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-4">
        {!isRunning ? (
          <>
            <button
              className="btn-primary"
              onClick={handleStart}
              disabled={!task.trim()}
            >
              <span className="flex items-center gap-2">
                <Play size={13} strokeWidth={3} />
                Start Focus
              </span>
            </button>
            {elapsed > 0 && (
              <button
                onClick={handleReset}
                className="p-3 text-[#444] hover:text-[#666] transition-colors"
                title="Reset"
              >
                <RotateCcw size={16} />
              </button>
            )}
          </>
        ) : (
          <>
            <button
              className="p-3 text-[#00ff87] hover:text-[#00ff87]/80 transition-colors"
              onClick={handlePause}
              title="Pause"
            >
              <Pause size={16} strokeWidth={2.5} fill="currentColor" />
            </button>
            <button className="btn-stop" onClick={handleStop}>
              <span className="flex items-center gap-2">
                <Square size={13} strokeWidth={3} fill="currentColor" />
                Stop & Save
              </span>
            </button>
          </>
        )}
      </div>

      {/* Motivational line */}
      {isRunning && (
        <p className="font-mono text-[10px] text-[#2a2a2a] tracking-widest uppercase slide-up">
          Stay locked in. You&apos;re doing great.
        </p>
      )}
    </div>
  );
}
