import { motion, AnimatePresence } from 'framer-motion';
import DayCell from './DayCell';
import RangeSelector from './RangeSelector';
import SpotlightCard from './reactbits/SpotlightCard';
import { MONTH_NAMES, DAY_LABELS } from '../utils/dateUtils';

/**
 * Calendar — The main calendar grid component.
 *
 * Includes:
 *  - Month/year header with navigation arrows
 *  - Day-of-week labels
 *  - Grid of DayCell components
 *  - RangeSelector status bar
 *  - 3D page-flip animation on month change
 *  - SpotlightCard wrapper from React Bits
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
    <SpotlightCard
      className="shadow-lg"
      spotlightColor="rgba(232, 122, 27, 0.12)"
    >
      {/* ─── Month Navigation Header ─── */}
      <div
        className="flex items-center justify-between px-4 sm:px-6 py-4"
        style={{ borderBottom: '1px solid var(--border-color)' }}
      >
        <motion.button
          whileHover={{ scale: 1.2, x: -3, rotateY: -15 }}
          whileTap={{ scale: 0.85 }}
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
            initial={{ opacity: 0, y: 15, rotateX: -30 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: -15, rotateX: 30 }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            className="text-center"
            style={{ perspective: '600px' }}
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
          whileHover={{ scale: 1.2, x: 3, rotateY: 15 }}
          whileTap={{ scale: 0.85 }}
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
            <motion.div
              key={label}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className="text-center text-xs font-semibold uppercase tracking-wider py-2"
              style={{
                color:
                  i === 0 || i === 6
                    ? '#e87a1b'
                    : 'var(--text-muted)',
              }}
            >
              {label}
            </motion.div>
          ))}
        </div>

        {/* Calendar grid with 3D flip animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${year}-${month}`}
            initial={{ opacity: 0, rotateX: -20, scale: 0.95 }}
            animate={{ opacity: 1, rotateX: 0, scale: 1 }}
            exit={{ opacity: 0, rotateX: 20, scale: 0.95 }}
            transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
            style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-4 pt-3"
          style={{ borderTop: '1px solid var(--border-color)' }}
        >
          <LegendItem color="#e87a1b" label="Today" />
          <LegendItem color="#10b981" label="Selected" />
          <LegendItem color="#ef4444" label="Holiday" dot />
          <LegendItem color="#3b82f6" label="US Holiday" dot />
          <LegendItem color="#f97316" label="Indian" dot />
          <LegendItem color="#e87a1b" label="Weekend" text />
        </motion.div>
      </div>
    </SpotlightCard>
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
