export function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function formatDuration(seconds) {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m < 60) return s > 0 ? `${m}m ${s}s` : `${m}m`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem > 0 ? `${h}h ${rem}m` : `${h}h`;
}

export function formatDate(isoString) {
  const d = new Date(isoString);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) +
    ' · ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export function secondsToMinutes(s) {
  return Math.round((s / 60) * 10) / 10;
}

// Truncate task name for chart labels
export function truncate(str, max = 10) {
  return str.length > max ? str.slice(0, max) + '…' : str;
}

/**
 * Get sessions for the current day
 * Compares against today's date
 */
export function getSessionsForDay(sessions) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return sessions.filter(session => {
    const sessionDate = new Date(session.date);
    sessionDate.setHours(0, 0, 0, 0);
    return sessionDate.getTime() === today.getTime();
  });
}

/**
 * Get sessions for the current week (last 7 days)
 * Monday-based week
 */
export function getSessionsForWeek(sessions) {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  
  const mondayDate = new Date(today);
  mondayDate.setDate(today.getDate() - daysToMonday);
  mondayDate.setHours(0, 0, 0, 0);
  
  const sundayDate = new Date(mondayDate);
  sundayDate.setDate(mondayDate.getDate() + 6);
  sundayDate.setHours(23, 59, 59, 999);
  
  return sessions.filter(session => {
    const sessionDate = new Date(session.date);
    return sessionDate >= mondayDate && sessionDate <= sundayDate;
  });
}

/**
 * Get sessions for the current month
 */
export function getSessionsForMonth(sessions) {
  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  monthStart.setHours(0, 0, 0, 0);
  
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  monthEnd.setHours(23, 59, 59, 999);
  
  return sessions.filter(session => {
    const sessionDate = new Date(session.date);
    return sessionDate >= monthStart && sessionDate <= monthEnd;
  });
}

/**
 * Group sessions by date for period-based charting
 * Returns array of dates with session counts and total duration
 */
export function groupSessionsByDate(sessions) {
  const grouped = {};
  
  sessions.forEach(session => {
    const date = new Date(session.date);
    const dateKey = date.toLocaleDateString('en-CA'); // YYYY-MM-DD format
    
    if (!grouped[dateKey]) {
      grouped[dateKey] = {
        date: dateKey,
        count: 0,
        totalDuration: 0,
        sessions: []
      };
    }
    
    grouped[dateKey].count += 1;
    grouped[dateKey].totalDuration += session.duration;
    grouped[dateKey].sessions.push(session);
  });
  
  return Object.values(grouped).sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );
}
