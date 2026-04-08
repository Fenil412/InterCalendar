import { motion, AnimatePresence } from 'framer-motion';
import DayCell from './DayCell';
import RangeSelector from './RangeSelector';
import { MONTH_NAMES, DAY_LABELS } from '../utils/dateUtils';

/**
 * Calendar — The main calendar grid component.
 *
 * Includes:
 *  - Month/year header with navigation arrows
 *  - Day-of-week labels
 *  - Grid of DayCell components
 *  - RangeSelector status bar
 *  - Smooth page-flip animation on month change
 */
export default function Calendar({
  year,
  month,
  grid,
  today,
  rangeStart,
  rangeEnd,
  holidays,
  onDayClick,
  onPrev,
  onNext,
  onClearRange,
}) {
  return (
    <div
      className="rounded-2xl overflow-hidden shadow-lg"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
      }}
    >
      {/* ─── Month Navigation Header ─── */}
      <div
        className="flex items-center justify-between px-4 sm:px-6 py-4"
        style={{ borderBottom: '1px solid var(--border-color)' }}
      >
        <motion.button
          whileHover={{ scale: 1.15, x: -2 }}
          whileTap={{ scale: 0.9 }}
          onClick={onPrev}
          className="p-2 rounded-xl transition-colors cursor-pointer"
          style={{
            color: 'var(--text-secondary)',
            backgroundColor: 'transparent',
          }}
          aria-label="Previous month"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </motion.button>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${year}-${month}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="text-center"
          >
            <h2
              className="text-xl sm:text-2xl font-bold"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--text-primary)',
              }}
            >
              {MONTH_NAMES[month]}
            </h2>
            <p
              className="text-xs sm:text-sm font-medium -mt-0.5"
              style={{ color: 'var(--text-muted)' }}
            >
              {year}
            </p>
          </motion.div>
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.15, x: 2 }}
          whileTap={{ scale: 0.9 }}
          onClick={onNext}
          className="p-2 rounded-xl transition-colors cursor-pointer"
          style={{
            color: 'var(--text-secondary)',
            backgroundColor: 'transparent',
          }}
          aria-label="Next month"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </motion.button>
      </div>

      {/* ─── Calendar Body ─── */}
      <div className="px-3 sm:px-5 py-4">
        {/* Range selector status */}
        <RangeSelector
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          onClear={onClearRange}
        />

        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 mb-2">
          {DAY_LABELS.map((label, i) => (
            <div
              key={label}
              className="text-center text-xs font-semibold uppercase tracking-wider py-2"
              style={{
                color:
                  i === 0 || i === 6
                    ? '#e87a1b'
                    : 'var(--text-muted)',
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Calendar grid with flip animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${year}-${month}`}
            initial={{ opacity: 0, rotateX: -15 }}
            animate={{ opacity: 1, rotateX: 0 }}
            exit={{ opacity: 0, rotateX: 15 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            style={{ perspective: '800px' }}
          >
            {grid.map((row, rowIdx) => (
              <div key={rowIdx} className="grid grid-cols-7 gap-1">
                {row.map((day, colIdx) => (
                  <DayCell
                    key={`${rowIdx}-${colIdx}`}
                    day={day}
                    year={year}
                    month={month}
                    today={today}
                    rangeStart={rangeStart}
                    rangeEnd={rangeEnd}
                    holidays={holidays}
                    onClick={onDayClick}
                    index={rowIdx * 7 + colIdx}
                  />
                ))}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Legend */}
        <div
          className="flex flex-wrap items-center justify-center gap-4 mt-4 pt-3"
          style={{ borderTop: '1px solid var(--border-color)' }}
        >
          <LegendItem color="#e87a1b" label="Today" />
          <LegendItem color="#10b981" label="Selected" />
          <LegendItem color="#ef4444" label="Holiday" dot />
          <LegendItem color="#e87a1b" label="Weekend" text />
        </div>
      </div>
    </div>
  );
}

/** Small legend indicator */
function LegendItem({ color, label, dot, text }) {
  return (
    <div className="flex items-center gap-1.5">
      {dot ? (
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: color }}
        />
      ) : text ? (
        <span className="text-xs font-bold" style={{ color }}>
          S
        </span>
      ) : (
        <span
          className="w-3 h-3 rounded-md"
          style={{ backgroundColor: color }}
        />
      )}
      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
        {label}
      </span>
    </div>
  );
}
