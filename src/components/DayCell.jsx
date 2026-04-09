import { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
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
 *  - Holiday (dot indicator + portal tooltip with description)
 *  - Range start (green left pill)
 *  - Range end (green right pill)
 *  - In-range (green background band)
 *
 * Holiday tooltip uses a React Portal so it renders at the body level
 * and is never clipped by parent overflow. Position is calculated
 * dynamically to stay within the viewport.
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
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0, placement: 'top' });
  const cellRef = useRef(null);

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

  /**
   * Calculate tooltip position relative to viewport.
   * Prefers showing above the cell; if not enough space, shows below.
   * Also clamps horizontally so it never overflows left/right.
   */
  const updateTooltipPosition = useCallback(() => {
    if (!cellRef.current) return;
    const rect = cellRef.current.getBoundingClientRect();
    const tooltipWidth = 260;
    const tooltipHeight = 120;
    const gap = 10;

    // Prefer placement above
    let placement = 'top';
    let top = rect.top - tooltipHeight - gap;
    if (top < 8) {
      // Not enough space above → show below
      placement = 'bottom';
      top = rect.bottom + gap;
    }

    // Center horizontally, but clamp to viewport
    let left = rect.left + rect.width / 2 - tooltipWidth / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - tooltipWidth - 8));

    setTooltipPos({ top, left, placement });
  }, []);

  /** Show tooltip on hover (desktop) or tap (mobile) */
  const handleShowTooltip = useCallback(() => {
    if (!holiday) return;
    updateTooltipPosition();
    setShowTooltip(true);
  }, [holiday, updateTooltipPosition]);

  const handleHideTooltip = useCallback(() => {
    setShowTooltip(false);
  }, []);

  /** On mobile: toggle tooltip on tap (separate from range click) */
  const handleClick = useCallback(() => {
    onClick(day);
    // On touch devices, briefly show tooltip if holiday exists
    if (holiday && 'ontouchstart' in window) {
      updateTooltipPosition();
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2500);
    }
  }, [day, holiday, onClick, updateTooltipPosition]);

  return (
    <>
      <motion.button
        ref={cellRef}
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
        onClick={handleClick}
        onMouseEnter={handleShowTooltip}
        onMouseLeave={handleHideTooltip}
        className={cellClasses.join(' ')}
        style={{
          ...bgStyle,
          color: textColor,
          ...ringStyle,
          transformStyle: 'preserve-3d',
        }}
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
          />
        )}

        {/* Today pulse ring */}
        {isToday && !isStart && !isEnd && (
          <span className="absolute inset-0 rounded-xl animate-pulse-glow" />
        )}

        {/* Start/End indicator dot */}
        {(isOnlyStart || isStart || isEnd) && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-stone-900"
            style={{ boxShadow: '0 0 6px rgba(16, 185, 129, 0.5)' }}
          />
        )}
      </motion.button>

      {/* Holiday Tooltip — rendered via Portal at body level to avoid clipping */}
      {createPortal(
        <AnimatePresence>
          {showTooltip && holiday && (
            <motion.div
              initial={{ opacity: 0, y: tooltipPos.placement === 'top' ? 6 : -6, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: tooltipPos.placement === 'top' ? 6 : -6, scale: 0.92 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="holiday-tooltip-portal"
              style={{
                position: 'fixed',
                top: tooltipPos.top,
                left: tooltipPos.left,
                width: 260,
                zIndex: 99990,
                pointerEvents: 'none',
              }}
            >
              <div className="flex items-center gap-2 mb-1.5">
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
              {/* Arrow indicator */}
              <div
                className="holiday-tooltip-arrow"
                data-placement={tooltipPos.placement}
              />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
