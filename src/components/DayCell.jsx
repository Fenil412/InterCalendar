import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDate, isSameDay, isDateInRange, isWeekend } from '../utils/dateUtils';

/**
 * DayCell — Renders a single day in the calendar grid.
 *
 * Visual states:
 *  - Empty cell (null day)
 *  - Normal day
 *  - Today (highlighted with glow)
 *  - Weekend (subtle tint)
 *  - Holiday (dot indicator + tooltip with description)
 *  - Range start (green left pill)
 *  - Range end (green right pill)
 *  - In-range (green background band)
 *
 * Enhanced with 3D transforms and rich holiday tooltips.
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
  const [showTooltip, setShowTooltip] = useState(false);

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
    ringStyle = { boxShadow: '0 0 0 2px rgba(232, 122, 27, 0.3), 0 4px 12px rgba(232, 122, 27, 0.2)' };
  } else if (isStart || isEnd) {
    bgStyle = { background: 'linear-gradient(135deg, #10b981, #059669)' };
    textColor = '#ffffff';
    ringStyle = { boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' };
  } else if (inRange) {
    bgStyle = { background: 'rgba(16, 185, 129, 0.12)' };
    textColor = '#059669';
  } else if (isWeekendDay) {
    textColor = '#e87a1b';
  }

  // Holiday type badge color
  const getHolidayBadgeClass = (type) => {
    switch (type) {
      case 'us': return 'badge-us';
      case 'indian': return 'badge-indian';
      case 'international': return 'badge-international';
      default: return 'badge-international';
    }
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.7, rotateX: -20 }}
      animate={{ opacity: 1, scale: 1, rotateX: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.012,
        ease: [0.23, 1, 0.32, 1]
      }}
      whileHover={{
        scale: 1.12,
        y: -2,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.9 }}
      onClick={() => onClick(day)}
      onMouseEnter={() => holiday && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      className={cellClasses.join(' ')}
      style={{
        ...bgStyle,
        color: textColor,
        ...ringStyle,
        transformStyle: 'preserve-3d',
      }}
      title={holiday?.name || `${day}`}
    >
      {/* Day number */}
      <span className={`relative z-10 ${isToday && !isStart && !isEnd ? 'font-bold' : ''}`}>
        {day}
      </span>

      {/* Holiday indicator dot */}
      {holiday && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute bottom-1 w-1.5 h-1.5 rounded-full"
          style={{
            backgroundColor: holiday.type === 'indian' ? '#f97316' : holiday.type === 'us' ? '#3b82f6' : '#ef4444'
          }}
          title={holiday.name}
        />
      )}

      {/* Today pulse ring */}
      {isToday && !isStart && !isEnd && (
        <span className="absolute inset-0 rounded-xl animate-pulse-glow" />
      )}

      {/* Start/End label */}
      {(isOnlyStart || isStart || isEnd) && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-stone-900"
          style={{ boxShadow: '0 0 6px rgba(16, 185, 129, 0.5)' }}
        />
      )}

      {/* Holiday Tooltip */}
      <AnimatePresence>
        {showTooltip && holiday && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="holiday-tooltip"
            style={{
              transformStyle: 'preserve-3d',
              transform: 'translateX(-50%) translateZ(20px)',
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${getHolidayBadgeClass(holiday.type)}`}>
                {holiday.type === 'us' ? '🇺🇸 US' : holiday.type === 'indian' ? '🇮🇳 IN' : '🌍 INTL'}
              </span>
            </div>
            <p className="text-xs font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>
              {holiday.name}
            </p>
            <p className="text-[10px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {holiday.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
