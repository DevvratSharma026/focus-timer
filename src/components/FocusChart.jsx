import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';
import { secondsToMinutes, truncate, getSessionsForDay, getSessionsForWeek, getSessionsForMonth, groupSessionsByDate } from '../utils';

const PERIODS = [
  { id: 'day', label: 'Day', icon: '📅' },
  { id: 'week', label: 'Week', icon: '📊' },
  { id: 'month', label: 'Month', icon: '📈' }
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    const isPeriodChart = d.dateLabel !== undefined;
    
    return (
      <div className="bg-[#111] border border-[#1e1e1e] px-4 py-3">
        {isPeriodChart ? (
          <>
            <p className="font-mono text-[10px] text-[#666] uppercase tracking-widest mb-1">Date</p>
            <p className="font-body text-sm text-[#e8e8e8] mb-2">{d.dateLabel}</p>
            <p className="font-mono text-[10px] text-[#666] uppercase tracking-widest mb-1">Sessions</p>
            <p className="font-mono text-sm text-[#e8e8e8] mb-2">{d.sessionCount}</p>
            <p className="font-mono text-[10px] text-[#666] uppercase tracking-widest mb-1">Total Duration</p>
            <p className="font-mono text-[#00ff87] font-bold">{d.label}</p>
          </>
        ) : (
          <>
            <p className="font-mono text-[10px] text-[#666] uppercase tracking-widest mb-1">Task</p>
            <p className="font-body text-sm text-[#e8e8e8] mb-2 max-w-[180px]">{d.task}</p>
            <p className="font-mono text-[10px] text-[#666] uppercase tracking-widest mb-1">Duration</p>
            <p className="font-mono text-[#00ff87] font-bold">{d.label}</p>
          </>
        )}
      </div>
    );
  }
  return null;
};

function FocusChart({ history }) {
  const [period, setPeriod] = useState('week');

  // Get sessions based on selected period
  const periodSessions = useMemo(() => {
    if (!history || history.length === 0) return [];
    
    switch (period) {
      case 'day':
        return getSessionsForDay(history);
      case 'week':
        return getSessionsForWeek(history);
      case 'month':
        return getSessionsForMonth(history);
      default:
        return [];
    }
  }, [history, period]);

  // Format data for recent sessions view (last 10)
  const recentSessionsData = useMemo(() => {
    if (periodSessions.length === 0) return [];
    
    return [...periodSessions]
      .slice(0, 10)
      .reverse()
      .map((s, i) => ({
        ...s,
        shortName: truncate(s.task, 9),
        minutes: secondsToMinutes(s.duration),
        label: s.duration < 60
          ? `${s.duration}s`
          : `${Math.floor(s.duration / 60)}m ${s.duration % 60 > 0 ? (s.duration % 60) + 's' : ''}`.trim(),
        isLatest: i === [...periodSessions].slice(0, 10).reverse().length - 1,
      }));
  }, [periodSessions]);

  // Format data for period aggregation view
  const periodAggregateData = useMemo(() => {
    if (periodSessions.length === 0) return [];
    
    const grouped = groupSessionsByDate(periodSessions);
    
    return grouped.map(day => ({
      ...day,
      dateLabel: new Date(day.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      minutes: secondsToMinutes(day.totalDuration),
      label: day.totalDuration < 60
        ? `${day.totalDuration}s`
        : `${Math.floor(day.totalDuration / 60)}m ${day.totalDuration % 60 > 0 ? (day.totalDuration % 60) + 's' : ''}`.trim(),
      sessionCount: day.count
    }));
  }, [periodSessions]);

  // Determine which chart data to show
  const chartData = period === 'day' ? recentSessionsData : periodAggregateData;

  if (!history || history.length === 0) return null;

  return (
    <div className="w-full slide-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-mono text-[10px] tracking-[0.2em] text-[#444] uppercase">
            Focus Sessions
          </h2>
          <p className="font-body text-xs text-[#333] mt-0.5">
            {periodSessions.length} session{periodSessions.length !== 1 ? 's' : ''} this {period}
          </p>
        </div>
        
        {/* Period Selector - Optimized Styling */}
        <div className="flex gap-1 p-1 bg-[#0f0f0f] border border-[#1a1a1a] rounded">
          {PERIODS.map(p => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`px-3 py-1.5 font-mono text-[9px] tracking-widest uppercase transition-all duration-200 rounded ${
                period === p.id
                  ? 'bg-[#00ff87] text-[#0a0a0a] font-bold shadow-[0_0_12px_rgba(0,255,135,0.3)]'
                  : 'text-[#666] hover:text-[#888] hover:bg-[#1a1a1a]'
              }`}
              title={p.label}
            >
              {p.icon} {p.label}
            </button>
          ))}
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="text-center py-12">
          <p className="font-mono text-[10px] text-[#2a2a2a] tracking-widest uppercase">
            No sessions this {period}
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} barSize={32} margin={{ top: 4, right: 4, left: -24, bottom: 4 }}>
            <CartesianGrid vertical={false} stroke="#1a1a1a" />
            <XAxis
              dataKey={period === 'day' ? 'shortName' : 'dateLabel'}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#444', fontFamily: 'JetBrains Mono' }}
              interval={0}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#333', fontFamily: 'JetBrains Mono' }}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff08' }} />
            <Bar dataKey="minutes" radius={[2, 2, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isLatest ? '#00ff87' : '#1e1e1e'}
                  stroke={entry.isLatest ? '#00ff87' : '#2a2a2a'}
                  strokeWidth={1}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      {/* Stats Footer - Period Analytics */}
      {periodSessions.length > 0 && (
        <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t border-[#1a1a1a]">
          <div className="p-3 bg-[#0f0f0f] rounded border border-[#1a1a1a] hover:border-[#2a2a2a] transition-colors">
            <p className="font-mono text-[9px] text-[#666] uppercase tracking-widest mb-1">Total Sessions</p>
            <p className="font-mono text-lg text-[#00ff87] font-bold">{periodSessions.length}</p>
          </div>
          <div className="p-3 bg-[#0f0f0f] rounded border border-[#1a1a1a] hover:border-[#2a2a2a] transition-colors">
            <p className="font-mono text-[9px] text-[#666] uppercase tracking-widest mb-1">Total Duration</p>
            <p className="font-mono text-lg text-[#00ff87] font-bold">
              {Math.floor(periodSessions.reduce((sum, s) => sum + s.duration, 0) / 60)}m
            </p>
          </div>
          <div className="p-3 bg-[#0f0f0f] rounded border border-[#1a1a1a] hover:border-[#2a2a2a] transition-colors">
            <p className="font-mono text-[9px] text-[#666] uppercase tracking-widest mb-1">Avg Duration</p>
            <p className="font-mono text-lg text-[#00ff87] font-bold">
              {Math.round(periodSessions.reduce((sum, s) => sum + s.duration, 0) / periodSessions.length / 60)}m
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(FocusChart, (prevProps, nextProps) => {
  // Re-render if history content changed
  return prevProps.history === nextProps.history;
});
