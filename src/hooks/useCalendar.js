import { useState, useMemo, useCallback } from 'react';
import {
  buildCalendarGrid,
  formatDate,
  formatMonthKey,
  getSeason,
  getHolidays,
} from '../utils/dateUtils';

/**
 * useCalendar — manages all calendar state:
 *  - Current month/year navigation
 *  - Calendar grid computation
 *  - Date range selection (start/end with 3-click reset)
 *  - Season-based hero image
 *  - Holiday data
 *
 * @returns {Object} Calendar state and handlers
 */
export function useCalendar() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-indexed
  const [rangeStart, setRangeStart] = useState(null); // 'YYYY-MM-DD' | null
  const [rangeEnd, setRangeEnd] = useState(null);     // 'YYYY-MM-DD' | null

  /** Memoised calendar grid (rows × 7 columns) */
  const grid = useMemo(() => buildCalendarGrid(year, month), [year, month]);

  /** Month key for notes lookup, e.g. '2026-04' */
  const monthKey = useMemo(() => formatMonthKey(year, month), [year, month]);

  /** Current season for hero image */
  const season = useMemo(() => getSeason(month), [month]);

  /** Holidays for current year */
  const holidays = useMemo(() => getHolidays(year), [year]);

  /** Navigate to the previous month */
  const prevMonth = useCallback(() => {
    setMonth((m) => {
      if (m === 0) {
        setYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
    // Clear selection on month change
    setRangeStart(null);
    setRangeEnd(null);
  }, []);

  /** Navigate to the next month */
  const nextMonth = useCallback(() => {
    setMonth((m) => {
      if (m === 11) {
        setYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
    // Clear selection on month change
    setRangeStart(null);
    setRangeEnd(null);
  }, []);

  /** Jump to today's month */
  const goToToday = useCallback(() => {
    const now = new Date();
    setYear(now.getFullYear());
    setMonth(now.getMonth());
    setRangeStart(null);
    setRangeEnd(null);
  }, []);

  /**
   * Handle a day click for range selection.
   * - 1st click → set start
   * - 2nd click → set end (swap if before start)
   * - 3rd click → reset
   */
  const handleDayClick = useCallback(
    (day) => {
      const dateStr = formatDate(new Date(year, month, day));

      if (rangeStart && rangeEnd) {
        // Third click → reset and start new selection
        setRangeStart(dateStr);
        setRangeEnd(null);
      } else if (rangeStart && !rangeEnd) {
        // Second click → set end, ensure start <= end
        if (dateStr < rangeStart) {
          setRangeEnd(rangeStart);
          setRangeStart(dateStr);
        } else {
          setRangeEnd(dateStr);
        }
      } else {
        // First click → set start
        setRangeStart(dateStr);
      }
    },
    [year, month, rangeStart, rangeEnd]
  );

  /** Clear the selected range */
  const clearRange = useCallback(() => {
    setRangeStart(null);
    setRangeEnd(null);
  }, []);

  return {
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
  };
}
