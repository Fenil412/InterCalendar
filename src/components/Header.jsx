import { motion } from 'framer-motion';

/**
 * Header — Top bar with:
 *  - App title & branding
 *  - Dark mode toggle with smooth icon transition
 *  - "Today" quick-jump button
 */
export default function Header({ darkMode, toggleDarkMode, onGoToToday }) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-0 z-50 backdrop-blur-xl border-b"
      style={{
        backgroundColor: darkMode
          ? 'rgba(12, 10, 9, 0.85)'
          : 'rgba(254, 251, 246, 0.85)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand */}
          <div className="flex items-center gap-3">
            {/* Calendar icon */}
            <div
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-md"
              style={{
                background: 'linear-gradient(135deg, #e87a1b, #d96011)',
              }}
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>

            <div>
              <h1
                className="text-lg sm:text-xl font-bold tracking-tight"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--text-primary)',
                }}
              >
                InterCalendar
              </h1>
              <p
                className="text-xs hidden sm:block -mt-0.5"
                style={{ color: 'var(--text-muted)' }}
              >
                Interactive Wall Calendar
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Today button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onGoToToday}
              className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer"
              style={{
                backgroundColor: darkMode
                  ? 'rgba(232, 122, 27, 0.15)'
                  : 'rgba(232, 122, 27, 0.1)',
                color: '#e87a1b',
                border: '1px solid rgba(232, 122, 27, 0.2)',
              }}
              title="Jump to today"
            >
              Today
            </motion.button>

            {/* Dark mode toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9, rotate: 180 }}
              onClick={toggleDarkMode}
              className="p-2 sm:p-2.5 rounded-xl transition-all cursor-pointer"
              style={{
                backgroundColor: darkMode
                  ? 'rgba(254, 243, 199, 0.1)'
                  : 'rgba(15, 23, 42, 0.06)',
                color: 'var(--text-primary)',
              }}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                /* Sun icon */
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                /* Moon icon */
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
