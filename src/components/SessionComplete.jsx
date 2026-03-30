import { CheckCircle } from 'lucide-react';
import { formatDuration } from '../utils';

export default function SessionComplete({ session, onDismiss }) {
  if (!session) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onDismiss}
    >
      <div
        className="bg-[#0f0f0f] border border-[#1e1e1e] p-10 max-w-sm w-full mx-4 text-center slide-up"
        onClick={e => e.stopPropagation()}
      >
        <CheckCircle size={32} className="text-[#00ff87] mx-auto mb-5" strokeWidth={1.5} />
        <p className="font-mono text-[10px] tracking-[0.25em] text-[#444] uppercase mb-3">
          Session Complete
        </p>
        <h3 className="font-body text-xl text-[#e8e8e8] mb-1 leading-snug">
          {session.task}
        </h3>
        <p className="font-mono text-[#00ff87] text-3xl font-bold mt-4 mb-6">
          {formatDuration(session.duration)}
        </p>
        <p className="font-mono text-[10px] text-[#333] tracking-wider mb-8">
          Saved to history
        </p>
        <button
          onClick={onDismiss}
          className="btn-primary w-full"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
