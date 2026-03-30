import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';
import { secondsToMinutes, truncate } from '../utils';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-[#111] border border-[#1e1e1e] px-4 py-3">
        <p className="font-mono text-[10px] text-[#666] uppercase tracking-widest mb-1">Task</p>
        <p className="font-body text-sm text-[#e8e8e8] mb-2 max-w-[180px]">{d.task}</p>
        <p className="font-mono text-[10px] text-[#666] uppercase tracking-widest mb-1">Duration</p>
        <p className="font-mono text-[#00ff87] font-bold">{d.label}</p>
      </div>
    );
  }
  return null;
};

export default function FocusChart({ history }) {
  if (!history || history.length === 0) return null;

  // Show last 10 sessions, oldest first (left → right)
  const data = [...history]
    .slice(0, 10)
    .reverse()
    .map((s, i) => ({
      ...s,
      shortName: truncate(s.task, 9),
      minutes: secondsToMinutes(s.duration),
      label: s.duration < 60
        ? `${s.duration}s`
        : `${Math.floor(s.duration / 60)}m ${s.duration % 60 > 0 ? (s.duration % 60) + 's' : ''}`.trim(),
      isLatest: i === [...history].slice(0, 10).reverse().length - 1,
    }));

  return (
    <div className="w-full slide-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-mono text-[10px] tracking-[0.2em] text-[#444] uppercase">
            Focus Sessions
          </h2>
          <p className="font-body text-xs text-[#333] mt-0.5">
            Last {data.length} session{data.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="font-mono text-[10px] text-[#333] tracking-wider">
          minutes
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barSize={32} margin={{ top: 4, right: 4, left: -24, bottom: 4 }}>
          <CartesianGrid vertical={false} stroke="#1a1a1a" />
          <XAxis
            dataKey="shortName"
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
            {data.map((entry, index) => (
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
    </div>
  );
}
