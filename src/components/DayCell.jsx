import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { formatDate, isSameDay, isDateInRange, isWeekend } from '../utils/dateUtils';

/**
 * DayCell — Renders a single day in the calendar grid.
 *
 * Visual states:
 *  - Empty cell (null day)
 *  - Normal day
 *  - Today (highlighted with glow)
 *  - Weekend (subtle tint)
 *  - Holiday (dot indicator)
 *  - Range start (green left pill)
 *  - Range end (green right pill)
 *  - In-range (green background band)
 */
export default function DayCell({
  day,
  year,
  month,
  today,
  rangeStart,
  rangeEnd,
  holidays,
  onClick,
  index,
}) {
  // If no day, render empty cell
  if (day === null) {
    return <div className="aspect-square" />;
  }

  const dateStr = formatDate(new Date(year, month, day));
  const isToday = isSameDay(new Date(year, month, day), today);
  const isWeekendDay = isWeekend(year, month, day);
  const holiday = holidays[dateStr];
  const isStart = rangeStart === dateStr;
  const isEnd = rangeEnd === dateStr;

  // Check if this day is within the selected range
  const inRange = useMemo(() => {
    if (!rangeStart || !rangeEnd) return false;
    return isDateInRange(dateStr, rangeStart, rangeEnd);
  }, [dateStr, rangeStart, rangeEnd]);

  // Only start selected (no end yet)
  const isOnlyStart = rangeStart === dateStr && !rangeEnd;

  // Build class names based on state
  const cellClasses = [
    'day-cell aspect-square flex flex-col items-center justify-center rounded-xl cursor-pointer select-none relative',
    'text-sm sm:text-base font-medium',
  ];

  // Background & text color logic
  let bgStyle = {};
  let textColor = 'var(--text-primary)';
  let ringStyle = {};

  if (isToday && !isStart && !isEnd) {
    bgStyle = { background: 'var(--calendar-today-bg)' };
    textColor = 'var(--calendar-today-text)';
    ringStyle = { boxShadow: '0 0 0 2px rgba(232, 122, 27, 0.3)' };
  } else if (isStart || isEnd) {
    bgStyle = { background: 'linear-gradient(135deg, #10b981, #059669)' };
    textColor = '#ffffff';
  } else if (inRange) {
    bgStyle = { background: 'rgba(16, 185, 129, 0.12)' };
    textColor = '#059669';
  } else if (isWeekendDay) {
    textColor = '#e87a1b';
  }

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, delay: index * 0.008 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={() => onClick(day)}
      className={cellClasses.join(' ')}
      style={{
        ...bgStyle,
        color: textColor,
        ...ringStyle,
      }}
      title={holiday || `${day}`}
    >
      {/* Day number */}
      <span className={`relative z-10 ${isToday && !isStart && !isEnd ? 'font-bold' : ''}`}>
        {day}
      </span>

      {/* Holiday indicator dot */}
      {holiday && (
        <span
          className="absolute bottom-1 w-1 h-1 rounded-full"
          style={{ backgroundColor: '#ef4444' }}
          title={holiday}
        />
      )}

      {/* Today pulse ring */}
      {isToday && !isStart && !isEnd && (
        <span className="absolute inset-0 rounded-xl animate-pulse-glow" />
      )}

      {/* Start/End label */}
      {(isOnlyStart || isStart || isEnd) && (
        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-stone-900" />
      )}
    </motion.button>
  );
}
