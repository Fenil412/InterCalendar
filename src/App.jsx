import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Calendar from './components/Calendar';
import NotesPanel from './components/NotesPanel';
import TiltedCard from './components/reactbits/TiltedCard';
import CountUp from './components/reactbits/CountUp';
import SpotlightCard from './components/reactbits/SpotlightCard';
import CustomCursor from './components/reactbits/CustomCursor';
import SplashCursor from './components/reactbits/SplashCursor';
import { useCalendar } from './hooks/useCalendar';
import { useLocalStorage } from './hooks/useLocalStorage';
import { MONTH_NAMES, MONTH_IMAGES, MONTH_EMOJI, MONTH_THEMES, getSeason } from './utils/dateUtils';

/**
 * App — Root component orchestrating the wall calendar layout.
 *
 * Layout (responsive):
 *  Desktop: Hero Image (left) | Calendar (center) | Notes (right)
 *  Tablet:  Hero Image (top) | Calendar + Notes (side by side)
 *  Mobile:  Hero Image → Calendar → Notes (stacked)
 *
 * Enhanced with:
 *  - React Bits TiltedCard for hero image (3D tilt)
 *  - React Bits CountUp for stat numbers
 *  - React Bits SpotlightCard for stat cards
 *  - React Bits CustomCursor (dual-ring animated cursor)
 *  - React Bits SplashCursor (WebGL fluid simulation background)
 *  - Per-month unique images (12 different images)
 *  - 3D CSS transforms and smooth animations
 *  - Floating particles background effect
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

  /** Month label for notes panel */
  const monthLabel = `${MONTH_NAMES[month]} ${year}`;

  /** Current month theme */
  const currentTheme = useMemo(() => MONTH_THEMES[month], [month]);

  /** Count holidays for this month */
  const monthHolidayCount = useMemo(() => {
    return Object.keys(holidays).filter((k) =>
      k.startsWith(monthKey)
    ).length;
  }, [holidays, monthKey]);

  /** Count days in month */
  const daysInMonth = useMemo(() => {
    return grid.flat().filter((d) => d !== null).length;
  }, [grid]);

  /** Selected days count */
  const selectedDays = useMemo(() => {
    if (!rangeStart || !rangeEnd) return 0;
    return Math.round(
      (new Date(rangeEnd) - new Date(rangeStart)) / (1000 * 60 * 60 * 24)
    ) + 1;
  }, [rangeStart, rangeEnd]);

  /** Notes count */
  const notesCount = useMemo(() => {
    return notes[monthKey]?.notes?.length || 0;
  }, [notes, monthKey]);

  /** Upcoming holidays list */
  const upcomingHolidays = useMemo(() => {
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    return Object.entries(holidays)
      .filter(([dateKey]) => dateKey >= todayStr && dateKey.startsWith(monthKey))
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(0, 3);
  }, [holidays, monthKey, today]);

  return (
    <div
      className="min-h-screen transition-colors duration-500"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* ─── React Bits: WebGL Fluid Cursor Background ─── */}
      <SplashCursor
        DENSITY_DISSIPATION={3.5}
        VELOCITY_DISSIPATION={2}
        SPLAT_RADIUS={0.2}
        SPLAT_FORCE={6000}
        CURL={3}
        COLOR_UPDATE_SPEED={10}
      />

      {/* ─── React Bits: Custom Dual-Ring Cursor (desktop only) ─── */}
      <CustomCursor />
      {/* ─── Floating Ambient Particles ─── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 200 + 100}px`,
              height: `${Math.random() * 200 + 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: currentTheme.gradient,
              opacity: darkMode ? 0.03 : 0.05,
              filter: 'blur(80px)',
            }}
            animate={{
              x: [0, Math.random() * 60 - 30, 0],
              y: [0, Math.random() * 60 - 30, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* ─── Header ─── */}
      <Header
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        onGoToToday={goToToday}
      />

      {/* ─── Main Content ─── */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* ─── Responsive Grid Layout ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ─── Hero Image Section with TiltedCard ─── */}
          <motion.div
            className="lg:col-span-4 order-1"
            initial={{ opacity: 0, x: -40, rotateY: -10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            style={{ perspective: '1200px' }}
          >
            {/* Month image with TiltedCard (React Bits) */}
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <AnimatePresence mode="wait">
                <motion.div
                  key={month}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                >
                  <TiltedCard
                    imageSrc={MONTH_IMAGES[month]}
                    altText={`${MONTH_NAMES[month]} landscape`}
                    captionText={`${MONTH_NAMES[month]} ${year}`}
                    containerHeight="320px"
                    containerWidth="100%"
                    imageHeight="320px"
                    imageWidth="100%"
                    scaleOnHover={1.05}
                    rotateAmplitude={10}
                    showMobileWarning={false}
                    showTooltip={true}
                  >
                    {/* Overlay content on the tilted card */}
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{MONTH_EMOJI[month]}</span>
                      <span className="text-xs font-semibold uppercase tracking-widest text-white/80">
                        {getSeason(month)}
                      </span>
                    </div>
                    <h2
                      className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {MONTH_NAMES[month]}
                    </h2>
                    <p className="text-sm text-white/70 font-medium">{year}</p>
                  </TiltedCard>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Month stats with SpotlightCard + CountUp (React Bits) */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="mt-4 hidden sm:block"
            >
              <SpotlightCard
                className="p-4 sm:p-5 shadow-md"
                spotlightColor={`${currentTheme.accent}20`}
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
                    value={notesCount}
                    accentColor={currentTheme.accent}
                  />
                  <StatCard
                    icon="📅"
                    label="Days"
                    value={daysInMonth}
                    accentColor={currentTheme.accent}
                  />
                  <StatCard
                    icon="🎉"
                    label="Holidays"
                    value={monthHolidayCount}
                    accentColor={currentTheme.accent}
                  />
                  <StatCard
                    icon="✅"
                    label="Selected"
                    value={selectedDays}
                    accentColor={currentTheme.accent}
                  />
                </div>
              </SpotlightCard>
            </motion.div>

            {/* Upcoming holidays card */}
            {upcomingHolidays.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className="mt-4 hidden lg:block"
              >
                <SpotlightCard
                  className="p-4 sm:p-5 shadow-md"
                  spotlightColor="rgba(239, 68, 68, 0.1)"
                >
                  <h3
                    className="text-sm font-bold mb-3"
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    Upcoming Holidays
                  </h3>
                  <div className="space-y-2">
                    {upcomingHolidays.map(([dateKey, info], idx) => {
                      const d = new Date(dateKey + 'T00:00:00');
                      const dayStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                      return (
                        <motion.div
                          key={dateKey}
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + idx * 0.1 }}
                          className="flex items-start gap-2 rounded-lg p-2 transition-all"
                          style={{
                            backgroundColor: 'var(--bg-tertiary)',
                            border: '1px solid var(--border-color)',
                          }}
                        >
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full mt-0.5 shrink-0 ${
                            info.type === 'us' ? 'badge-us' : info.type === 'indian' ? 'badge-indian' : 'badge-international'
                          }`}>
                            {dayStr}
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                              {info.name}
                            </p>
                            <p className="text-[10px] line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                              {info.description}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </SpotlightCard>
              </motion.div>
            )}
          </motion.div>

          {/* ─── Calendar Section ─── */}
          <motion.div
            className="lg:col-span-4 order-2"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
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
            initial={{ opacity: 0, x: 40, rotateY: 10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.23, 1, 0.32, 1] }}
            style={{ perspective: '1200px' }}
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="mt-10 pb-6 text-center"
        >
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            InterCalendar — Built with React, Tailwind CSS, Framer Motion & React Bits
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
 * StatCard — Small metric card with CountUp animation (React Bits).
 * Uses 3D hover effects.
 */
function StatCard({ icon, label, value, accentColor }) {
  return (
    <motion.div
      whileHover={{
        scale: 1.05,
        rotateX: -3,
        rotateY: 5,
        boxShadow: `0 8px 20px ${accentColor}15`,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="rounded-xl p-3 text-center transition-all cursor-default card-3d"
      style={{
        backgroundColor: 'var(--bg-tertiary)',
        border: '1px solid var(--border-color)',
        transformStyle: 'preserve-3d',
      }}
    >
      <motion.span
        className="text-lg"
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
      >
        {icon}
      </motion.span>
      <p
        className="text-lg font-bold mt-0.5"
        style={{ color: 'var(--text-primary)' }}
      >
        <CountUp
          from={0}
          to={value}
          duration={1.5}
          className="tabular-nums"
        />
      </p>
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
        {label}
      </p>
    </motion.div>
  );
}
