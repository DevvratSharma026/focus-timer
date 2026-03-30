import { Trash2 } from 'lucide-react';
import { formatDuration, formatDate } from '../utils';

export default function SessionHistory({ history, onDelete, onClear }) {
  if (!history || history.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="font-mono text-xs text-[#2a2a2a] tracking-widest uppercase">
          No sessions yet
        </p>
        <p className="font-body text-xs text-[#222] mt-2">
          Complete a focus session to see your history
        </p>
      </div>
    );
  }

  const totalSeconds = history.reduce((sum, s) => sum + s.duration, 0);
  const totalMinutes = Math.floor(totalSeconds / 60);

  return (
    <div className="slide-up">
      {/* Stats bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-6">
          <div>
            <p className="font-mono text-[10px] tracking-[0.15em] text-[#444] uppercase">Sessions</p>
            <p className="font-mono text-lg text-[#e8e8e8] font-bold">{history.length}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] tracking-[0.15em] text-[#444] uppercase">Total Focus</p>
            <p className="font-mono text-lg text-[#00ff87] font-bold">{formatDuration(totalSeconds)}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] tracking-[0.15em] text-[#444] uppercase">Avg / Session</p>
            <p className="font-mono text-lg text-[#e8e8e8] font-bold">
              {formatDuration(Math.round(totalSeconds / history.length))}
            </p>
          </div>
        </div>
        <button
          onClick={onClear}
          className="font-mono text-[10px] tracking-widest text-[#333] hover:text-[#ff4757] transition-colors uppercase flex items-center gap-1.5"
          title="Clear all history"
        >
          <Trash2 size={11} />
          Clear All
        </button>
      </div>

      {/* Session list */}
      <div className="flex flex-col gap-0">
        {history.map((session, idx) => (
          <div
            key={session.id}
            className="group flex items-center justify-between py-3.5 border-b border-[#111] hover:bg-[#0f0f0f] transition-colors px-1"
          >
            <div className="flex items-center gap-4 min-w-0">
              <span className="font-mono text-[10px] text-[#2a2a2a] w-5 flex-shrink-0 text-right">
                {history.length - idx}
              </span>
              <div className="min-w-0">
                <p className="font-body text-sm text-[#c8c8c8] truncate max-w-[200px] sm:max-w-[300px]">
                  {session.task}
                </p>
                <p className="font-mono text-[10px] text-[#333] mt-0.5">
                  {formatDate(session.date)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <span className="font-mono text-sm text-[#00ff87] font-bold">
                {formatDuration(session.duration)}
              </span>
              <button
                onClick={() => onDelete(session.id)}
                className="opacity-0 group-hover:opacity-100 text-[#333] hover:text-[#ff4757] transition-all p-1"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
