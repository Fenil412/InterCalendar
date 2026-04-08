import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Calendar from './components/Calendar';
import NotesPanel from './components/NotesPanel';
import { useCalendar } from './hooks/useCalendar';
import { useLocalStorage } from './hooks/useLocalStorage';
import { MONTH_NAMES, getSeason } from './utils/dateUtils';

/**
 * App — Root component orchestrating the wall calendar layout.
 *
 * Layout (responsive):
 *  Desktop: Hero Image (left) | Calendar (center) | Notes (right)
 *  Tablet:  Hero Image (top) | Calendar + Notes (side by side)
 *  Mobile:  Hero Image → Calendar → Notes (stacked)
 */
export default function App() {
  // ─── Dark Mode ───
  const [darkMode, setDarkMode] = useLocalStorage('intercalendar-dark', false);

  // ─── Calendar State ───
  const {
    year,
    month,
    grid,
    monthKey,
    season,
    holidays,
    rangeStart,
    rangeEnd,
    prevMonth,
    nextMonth,
    goToToday,
    handleDayClick,
    clearRange,
    today,
  } = useCalendar();

  // ─── Notes State (persisted) ───
  const [notes, setNotes] = useLocalStorage('intercalendar-notes', {});

  // ─── Apply dark mode class to <html> ───
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  /** Hero image mapping by season */
  const heroImages = {
    spring: '/images/spring.png',
    summer: '/images/summer.png',
    autumn: '/images/autumn.png',
    winter: '/images/winter.png',
  };

  /** Season-themed gradient overlays */
  const seasonGradients = {
    spring: 'from-emerald-500/20 via-transparent to-pink-500/10',
    summer: 'from-amber-500/20 via-transparent to-sky-500/10',
    autumn: 'from-orange-500/20 via-transparent to-red-500/10',
    winter: 'from-blue-500/20 via-transparent to-purple-500/10',
  };

  /** Season emoji */
  const seasonEmoji = {
    spring: '🌸',
    summer: '☀️',
    autumn: '🍂',
    winter: '❄️',
  };

  /** Month label for notes panel */
  const monthLabel = `${MONTH_NAMES[month]} ${year}`;

  /** Current hero image */
  const currentSeason = useMemo(() => getSeason(month), [month]);

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* ─── Header ─── */}
      <Header
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        onGoToToday={goToToday}
      />

      {/* ─── Main Content ─── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* ─── Responsive Grid Layout ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ─── Hero Image Section ─── */}
          <motion.div
            className="lg:col-span-4 order-1"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div
              className="rounded-2xl overflow-hidden shadow-lg relative group"
              style={{
                border: '1px solid var(--border-color)',
              }}
            >
              {/* Image container */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSeason}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6 }}
                  className="hero-image-container"
                >
                  <img
                    src={heroImages[currentSeason]}
                    alt={`${currentSeason} landscape`}
                    className="w-full h-48 sm:h-56 md:h-64 lg:h-80 object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${seasonGradients[currentSeason]} opacity-60`}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Season info overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                <motion.div
                  key={`${month}-${year}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{seasonEmoji[currentSeason]}</span>
                    <span className="text-xs font-semibold uppercase tracking-widest text-white/80">
                      {currentSeason}
                    </span>
                  </div>
                  <h2
                    className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {MONTH_NAMES[month]}
                  </h2>
                  <p className="text-sm text-white/70 font-medium">{year}</p>
                </motion.div>
              </div>
            </div>

            {/* Quick stats card below hero */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-4 rounded-2xl p-4 sm:p-5 shadow-md hidden sm:block"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
              }}
            >
              <h3
                className="text-sm font-bold mb-3"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--text-primary)',
                }}
              >
                Month at a Glance
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <StatCard
                  icon="📝"
                  label="Notes"
                  value={notes[monthKey]?.notes?.length || 0}
                />
                <StatCard
                  icon="📅"
                  label="Days"
                  value={
                    grid.flat().filter((d) => d !== null).length
                  }
                />
                <StatCard
                  icon="🎉"
                  label="Holidays"
                  value={
                    Object.keys(holidays).filter((k) =>
                      k.startsWith(monthKey)
                    ).length
                  }
                />
                <StatCard
                  icon="✅"
                  label="Selected"
                  value={
                    rangeStart && rangeEnd
                      ? Math.round(
                          (new Date(rangeEnd) - new Date(rangeStart)) /
                            (1000 * 60 * 60 * 24)
                        ) + 1
                      : 0
                  }
                />
              </div>
            </motion.div>
          </motion.div>

          {/* ─── Calendar Section ─── */}
          <motion.div
            className="lg:col-span-4 order-2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          >
            <Calendar
              year={year}
              month={month}
              grid={grid}
              today={today}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              holidays={holidays}
              onDayClick={handleDayClick}
              onPrev={prevMonth}
              onNext={nextMonth}
              onClearRange={clearRange}
            />
          </motion.div>

          {/* ─── Notes Section ─── */}
          <motion.div
            className="lg:col-span-4 order-3"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          >
            <NotesPanel
              monthKey={monthKey}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              notes={notes}
              setNotes={setNotes}
              monthLabel={monthLabel}
            />
          </motion.div>
        </div>

        {/* ─── Footer ─── */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-10 pb-6 text-center"
        >
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            InterCalendar — Built with React, Tailwind CSS & Framer Motion
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
            Data is stored locally in your browser
          </p>
        </motion.footer>
      </main>
    </div>
  );
}

/**
 * StatCard — Small metric card for the "Month at a Glance" section.
 */
function StatCard({ icon, label, value }) {
  return (
    <div
      className="rounded-xl p-3 text-center transition-all"
      style={{
        backgroundColor: 'var(--bg-tertiary)',
        border: '1px solid var(--border-color)',
      }}
    >
      <span className="text-lg">{icon}</span>
      <p
        className="text-lg font-bold mt-0.5"
        style={{ color: 'var(--text-primary)' }}
      >
        {value}
      </p>
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
        {label}
      </p>
    </div>
  );
}
