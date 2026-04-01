import { useState } from 'react';
import { Timer, BarChart2, Clock } from 'lucide-react';
import TimerPanel from './components/TimerPanel';
import FocusChart from './components/FocusChart';
import SessionHistory from './components/SessionHistory';
import SessionComplete from './components/SessionComplete';
import { useHistory } from './hooks/useHistory';
import { useTimer } from './hooks/useTimer';

const TABS = [
  { id: 'timer', label: 'Focus', icon: Timer },
  { id: 'chart', label: 'Chart', icon: BarChart2 },
  { id: 'history', label: 'History', icon: Clock },
];

export default function App() {
  const [tab, setTab] = useState('timer');
  const [lastSession, setLastSession] = useState(null);
  const [task, setTask] = useState('');
  const [activeTask, setActiveTask] = useState('');
  const { history, addSession, clearHistory, deleteSession } = useHistory();
  const timerState = useTimer();

  const handleSessionComplete = (task, duration) => {
    const session = addSession(task, duration);
    setLastSession(session);
    setTimeout(() => setTab('chart'), 600);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e8e8e8] flex flex-col">
      <header className="border-b border-[#111] px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-[#00ff87] flex items-center justify-center">
            <div className="w-2 h-2 bg-[#0a0a0a]" />
          </div>
          <h1 className="font-display text-xl tracking-[0.1em] leading-none text-[#e8e8e8]">
            FOCUSFLOW
          </h1>
        </div>
        <div className="font-mono text-[10px] text-[#2a2a2a] tracking-widest uppercase hidden sm:block">
          {history.length} session{history.length !== 1 ? 's' : ''} logged
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 pt-12 pb-24 max-w-2xl mx-auto w-full">
        <div className="flex gap-0 mb-12 border border-[#111] self-start">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-5 py-2.5 font-mono text-[10px] tracking-[0.15em] uppercase transition-all
                ${tab === id
                  ? 'bg-[#00ff87] text-[#0a0a0a]'
                  : 'text-[#444] hover:text-[#666] hover:bg-[#0f0f0f]'
                }`}
            >
              <Icon size={11} strokeWidth={2.5} />
              {label}
            </button>
          ))}
        </div>

        {tab === 'timer' && (
          <TimerPanel 
            onSessionComplete={handleSessionComplete} 
            timerState={timerState}
            task={task}
            setTask={setTask}
            activeTask={activeTask}
            setActiveTask={setActiveTask}
          />
        )}

        {tab === 'chart' && (
          <div className="w-full">
            <FocusChart history={history} />
            {history.length === 0 && (
              <div className="text-center py-20">
                <p className="font-mono text-[10px] text-[#2a2a2a] tracking-widest uppercase">No data yet</p>
                <p className="font-body text-xs text-[#222] mt-2">Complete a session to see your focus chart</p>
              </div>
            )}
          </div>
        )}

        {tab === 'history' && (
          <div className="w-full">
            <SessionHistory
              history={history}
              onDelete={deleteSession}
              onClear={clearHistory}
            />
          </div>
        )}
      </main>

      <SessionComplete session={lastSession} onDismiss={() => setLastSession(null)} />
    </div>
  );
}
