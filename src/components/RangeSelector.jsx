import { motion, AnimatePresence } from 'framer-motion';

/**
 * RangeSelector — Displays the current date range selection status.
 * Shows start date, end date, and total days selected.
 * Provides a clear button to reset the selection.
 */
export default function RangeSelector({ rangeStart, rangeEnd, onClear }) {
  // Calculate number of days in range
  const dayCount =
    rangeStart && rangeEnd
      ? Math.round(
          (new Date(rangeEnd) - new Date(rangeStart)) / (1000 * 60 * 60 * 24)
        ) + 1
      : 0;

  /** Format a 'YYYY-MM-DD' to a human-readable short date */
  const formatShort = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <AnimatePresence mode="wait">
      {rangeStart ? (
        <motion.div
          key="range-info"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="rounded-xl p-3 sm:p-4 mb-4"
          style={{
            backgroundColor: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Start */}
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: '#10b981' }}
                />
                <span
                  className="text-xs font-medium"
                  style={{ color: 'var(--text-muted)' }}
                >
                  From
                </span>
                <span
                  className="text-sm font-semibold"
                  style={{ color: '#10b981' }}
                >
                  {formatShort(rangeStart)}
                </span>
              </div>

              {/* Arrow */}
              {rangeEnd && (
                <>
                  <svg
                    className="w-4 h-4"
                    style={{ color: 'var(--text-muted)' }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>

                  {/* End */}
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: '#059669' }}
                    />
                    <span
                      className="text-xs font-medium"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      To
                    </span>
                    <span
                      className="text-sm font-semibold"
                      style={{ color: '#059669' }}
                    >
                      {formatShort(rangeEnd)}
                    </span>
                  </div>

                  {/* Day count badge */}
                  <span className="selection-pill ml-1">
                    {dayCount} day{dayCount !== 1 ? 's' : ''}
                  </span>
                </>
              )}

              {!rangeEnd && (
                <span
                  className="text-xs italic"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Click another date to set end
                </span>
              )}
            </div>

            {/* Clear button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClear}
              className="p-1.5 rounded-lg transition-colors cursor-pointer"
              style={{
                color: 'var(--text-muted)',
              }}
              title="Clear selection"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="range-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-center py-2 mb-3"
        >
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Click a date to start selecting a range
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
