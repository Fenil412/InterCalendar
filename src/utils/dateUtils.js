/**
 * dateUtils.js
 * Pure utility functions for date manipulation.
 * No side effects — all functions are deterministic.
 */

/** Full month names */
export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Short day-of-week labels starting from Sunday */
export const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Get the number of days in a given month/year.
 * @param {number} year
 * @param {number} month - 0-indexed (0 = January)
 * @returns {number}
 */
export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Get the day-of-week the month starts on (0 = Sunday).
 * @param {number} year
 * @param {number} month - 0-indexed
 * @returns {number}
 */
export function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

/**
 * Format a Date as 'YYYY-MM-DD'.
 * @param {Date} date
 * @returns {string}
 */
export function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Format a month key like '2026-04'.
 * @param {number} year
 * @param {number} month - 0-indexed
 * @returns {string}
 */
export function formatMonthKey(year, month) {
  return `${year}-${String(month + 1).padStart(2, '0')}`;
}

/**
 * Parse a 'YYYY-MM-DD' string into a Date object (local time).
 * @param {string} dateStr
 * @returns {Date}
 */
export function parseDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/**
 * Check if two dates represent the same calendar day.
 * @param {Date} a
 * @param {Date} b
 * @returns {boolean}
 */
export function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Check if a date falls on a weekend (Saturday or Sunday).
 * @param {number} year
 * @param {number} month - 0-indexed
 * @param {number} day - 1-indexed
 * @returns {boolean}
 */
export function isWeekend(year, month, day) {
  const dow = new Date(year, month, day).getDay();
  return dow === 0 || dow === 6;
}

/**
 * Determine the season for a given month (0-indexed).
 * Used to select the hero image.
 * @param {number} month - 0-indexed
 * @returns {'spring' | 'summer' | 'autumn' | 'winter'}
 */
export function getSeason(month) {
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
}

/**
 * Check whether a given date string falls within a range [start, end].
 * Comparison is inclusive on both ends.
 * @param {string} dateStr  - 'YYYY-MM-DD'
 * @param {string} startStr - 'YYYY-MM-DD'
 * @param {string} endStr   - 'YYYY-MM-DD'
 * @returns {boolean}
 */
export function isDateInRange(dateStr, startStr, endStr) {
  return dateStr >= startStr && dateStr <= endStr;
}

/**
 * Build a 2D array of calendar cells for a given month.
 * Each cell is either `null` (empty) or a day number.
 * @param {number} year
 * @param {number} month - 0-indexed
 * @returns {(number|null)[][]}
 */
export function buildCalendarGrid(year, month) {
  const daysInMonth = getDaysInMonth(year, month);
  const startDay = getFirstDayOfMonth(year, month);
  const rows = [];
  let currentRow = new Array(7).fill(null);
  let dayCounter = 1;

  // Fill the first row starting from the correct day
  for (let i = startDay; i < 7 && dayCounter <= daysInMonth; i++) {
    currentRow[i] = dayCounter++;
  }
  rows.push(currentRow);

  // Fill remaining rows
  while (dayCounter <= daysInMonth) {
    currentRow = new Array(7).fill(null);
    for (let i = 0; i < 7 && dayCounter <= daysInMonth; i++) {
      currentRow[i] = dayCounter++;
    }
    rows.push(currentRow);
  }

  return rows;
}

/**
 * Generate a list of notable holidays (US-centric, simplified).
 * Returns an object keyed by 'YYYY-MM-DD' with holiday name.
 * @param {number} year
 * @returns {Object.<string, string>}
 */
export function getHolidays(year) {
  const holidays = {};
  // New Year's Day
  holidays[`${year}-01-01`] = "New Year's Day";
  // Valentine's Day
  holidays[`${year}-02-14`] = "Valentine's Day";
  // Independence Day
  holidays[`${year}-07-04`] = 'Independence Day';
  // Halloween
  holidays[`${year}-10-31`] = 'Halloween';
  // Christmas
  holidays[`${year}-12-25`] = 'Christmas';
  // Republic Day (India)
  holidays[`${year}-01-26`] = 'Republic Day';
  // Holi (approx)
  holidays[`${year}-03-14`] = 'Holi';
  // Diwali (approx)
  holidays[`${year}-10-20`] = 'Diwali';
  return holidays;
}
