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

/** Month images mapping (0-indexed) */
export const MONTH_IMAGES = [
  '/images/january.png',
  '/images/february.png',
  '/images/march.png',
  '/images/april.png',
  '/images/may.png',
  '/images/june.png',
  '/images/july.png',
  '/images/august.png',
  '/images/september.png',
  '/images/october.png',
  '/images/november.png',
  '/images/december.png',
];

/** Month emoji */
export const MONTH_EMOJI = [
  '❄️',  // January
  '💕',  // February
  '🌱',  // March
  '🌸',  // April
  '🌺',  // May
  '☀️',  // June
  '🏖️',  // July
  '🌅',  // August
  '🍁',  // September
  '🎃',  // October
  '🍂',  // November
  '🎄',  // December
];

/** Month color themes */
export const MONTH_THEMES = [
  { gradient: 'linear-gradient(135deg, #a8c0ff, #3f2b96)', accent: '#3f2b96' },     // Jan
  { gradient: 'linear-gradient(135deg, #ff9a9e, #fecfef)', accent: '#e91e63' },     // Feb
  { gradient: 'linear-gradient(135deg, #a8e6cf, #dcedc1)', accent: '#2e7d32' },     // Mar
  { gradient: 'linear-gradient(135deg, #fbc2eb, #a6c1ee)', accent: '#e91e8c' },     // Apr
  { gradient: 'linear-gradient(135deg, #84fab0, #8fd3f4)', accent: '#00bfa5' },     // May
  { gradient: 'linear-gradient(135deg, #ffecd2, #fcb69f)', accent: '#ff6f00' },     // Jun
  { gradient: 'linear-gradient(135deg, #667eea, #764ba2)', accent: '#304ffe' },     // Jul
  { gradient: 'linear-gradient(135deg, #f093fb, #f5576c)', accent: '#d500f9' },     // Aug
  { gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)', accent: '#0288d1' },     // Sep
  { gradient: 'linear-gradient(135deg, #fa709a, #fee140)', accent: '#ff5722' },     // Oct
  { gradient: 'linear-gradient(135deg, #a18cd1, #fbc2eb)', accent: '#7b1fa2' },     // Nov
  { gradient: 'linear-gradient(135deg, #d4fc79, #96e6a1)', accent: '#1b5e20' },     // Dec
];

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
 * Helper: get nth weekday of a month (for floating holidays).
 * @param {number} year
 * @param {number} month - 0-indexed
 * @param {number} dayOfWeek - 0 = Sunday, 1 = Monday, etc.
 * @param {number} n - 1-based (1st, 2nd, 3rd, etc.) or -1 for last
 * @returns {number} day of month
 */
function getNthWeekday(year, month, dayOfWeek, n) {
  if (n > 0) {
    const firstDay = new Date(year, month, 1).getDay();
    let day = 1 + ((dayOfWeek - firstDay + 7) % 7);
    day += (n - 1) * 7;
    return day;
  } else {
    // Last occurrence
    const lastDay = getDaysInMonth(year, month);
    const lastDayOfWeek = new Date(year, month, lastDay).getDay();
    let day = lastDay - ((lastDayOfWeek - dayOfWeek + 7) % 7);
    return day;
  }
}

/**
 * Calculate Easter Sunday date (Computus algorithm).
 * @param {number} year
 * @returns {Date}
 */
function getEaster(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month, day);
}

/**
 * Generate a comprehensive list of holidays (US + India + International).
 * Returns an object keyed by 'YYYY-MM-DD' with holiday name and description.
 * @param {number} year
 * @returns {Object.<string, {name: string, description: string, type: string}>}
 */
export function getHolidays(year) {
  const holidays = {};
  const pad = (n) => String(n).padStart(2, '0');
  const key = (m, d) => `${year}-${pad(m)}-${pad(d)}`;

  // ── January ──
  holidays[key(1, 1)] = {
    name: "New Year's Day",
    description: "First day of the Gregorian calendar year, celebrated worldwide with fireworks and festivities.",
    type: "international"
  };
  holidays[key(1, 15)] = {
    name: "Makar Sankranti / Pongal",
    description: "Hindu harvest festival marking the sun's transit into Capricorn. Celebrated with kite flying and traditional foods.",
    type: "indian"
  };
  const mlkDay = getNthWeekday(year, 0, 1, 3); // 3rd Monday of January
  holidays[key(1, mlkDay)] = {
    name: "Martin Luther King Jr. Day",
    description: "US federal holiday honoring civil rights leader Dr. Martin Luther King Jr. and his legacy of nonviolent activism.",
    type: "us"
  };
  holidays[key(1, 26)] = {
    name: "Republic Day (India)",
    description: "National holiday commemorating the adoption of the Indian Constitution on January 26, 1950. Celebrated with grand parades in New Delhi.",
    type: "indian"
  };

  // ── February ──
  holidays[key(2, 2)] = {
    name: "Groundhog Day",
    description: "Traditional holiday where Punxsutawney Phil predicts whether there will be six more weeks of winter.",
    type: "us"
  };
  holidays[key(2, 14)] = {
    name: "Valentine's Day",
    description: "Day of love and romance celebrated worldwide with exchanging cards, flowers, and gifts with loved ones.",
    type: "international"
  };
  const presDay = getNthWeekday(year, 1, 1, 3); // 3rd Monday of February
  holidays[key(2, presDay)] = {
    name: "Presidents' Day",
    description: "US federal holiday honoring all US presidents, originally established to celebrate George Washington's birthday.",
    type: "us"
  };

  // ── March ──
  holidays[key(3, 8)] = {
    name: "International Women's Day",
    description: "Global day celebrating women's social, economic, cultural, and political achievements.",
    type: "international"
  };
  holidays[key(3, 17)] = {
    name: "St. Patrick's Day",
    description: "Cultural and religious celebration of Ireland's patron saint, marked by parades, wearing green, and Irish festivities.",
    type: "international"
  };
  // Holi - approximate dates (varies by lunar calendar)
  const holiDates = { 2024: [3, 25], 2025: [3, 14], 2026: [3, 3], 2027: [3, 22], 2028: [3, 11] };
  if (holiDates[year]) {
    holidays[key(holiDates[year][0], holiDates[year][1])] = {
      name: "Holi",
      description: "Hindu festival of colors celebrating the victory of good over evil. People throw colored powders and water at each other.",
      type: "indian"
    };
  }

  // ── April ──
  holidays[key(4, 1)] = {
    name: "April Fools' Day",
    description: "A day for playing practical jokes and hoaxes on unsuspecting people. Not an official holiday but widely observed.",
    type: "international"
  };
  holidays[key(4, 14)] = {
    name: "Baisakhi / Ambedkar Jayanti",
    description: "Baisakhi marks the Sikh New Year and spring harvest festival. Ambedkar Jayanti honors the birth of B.R. Ambedkar, architect of India's constitution.",
    type: "indian"
  };
  holidays[key(4, 22)] = {
    name: "Earth Day",
    description: "Annual event demonstrating support for environmental protection. First held on April 22, 1970.",
    type: "international"
  };
  // Easter
  const easter = getEaster(year);
  const easterMonth = easter.getMonth() + 1;
  const easterDay = easter.getDate();
  holidays[key(easterMonth, easterDay)] = {
    name: "Easter Sunday",
    description: "Christian holiday celebrating the resurrection of Jesus Christ. Traditions include Easter egg hunts, church services, and family gatherings.",
    type: "international"
  };
  // Good Friday (2 days before Easter)
  const goodFriday = new Date(easter);
  goodFriday.setDate(goodFriday.getDate() - 2);
  holidays[key(goodFriday.getMonth() + 1, goodFriday.getDate())] = {
    name: "Good Friday",
    description: "Christian observance commemorating the crucifixion of Jesus Christ, observed two days before Easter Sunday.",
    type: "international"
  };

  // ── May ──
  holidays[key(5, 1)] = {
    name: "International Workers' Day",
    description: "Global celebration of workers and the labor movement. Public holiday in many countries around the world.",
    type: "international"
  };
  const motherDay = getNthWeekday(year, 4, 0, 2); // 2nd Sunday of May
  holidays[key(5, motherDay)] = {
    name: "Mother's Day",
    description: "A day honoring mothers and mother figures with gifts, cards, and celebrations of their love and sacrifice.",
    type: "international"
  };
  const memDay = getNthWeekday(year, 4, 1, -1); // Last Monday of May
  holidays[key(5, memDay)] = {
    name: "Memorial Day",
    description: "US federal holiday honoring military personnel who have died in service. Marks the unofficial start of summer.",
    type: "us"
  };

  // ── June ──
  holidays[key(6, 5)] = {
    name: "World Environment Day",
    description: "UN-established day to encourage worldwide awareness and action for the protection of the environment.",
    type: "international"
  };
  const fatherDay = getNthWeekday(year, 5, 0, 3); // 3rd Sunday of June
  holidays[key(6, fatherDay)] = {
    name: "Father's Day",
    description: "A day celebrating fathers and father figures, expressing gratitude for their love and guidance.",
    type: "international"
  };
  holidays[key(6, 21)] = {
    name: "International Yoga Day / Summer Solstice",
    description: "UN-declared day promoting yoga's benefits for health. Also the longest day of the year in the Northern Hemisphere.",
    type: "international"
  };

  // ── July ──
  holidays[key(7, 4)] = {
    name: "Independence Day (USA)",
    description: "Celebrates the adoption of the Declaration of Independence on July 4, 1776. Marked with fireworks, parades, and barbecues.",
    type: "us"
  };

  // ── August ──
  holidays[key(8, 15)] = {
    name: "Independence Day (India)",
    description: "National holiday celebrating India's independence from British rule on August 15, 1947. Flag hoisting and cultural events nationwide.",
    type: "indian"
  };
  // Raksha Bandhan - approximate dates
  const rakshaDates = { 2024: [8, 19], 2025: [8, 9], 2026: [8, 28], 2027: [8, 17], 2028: [8, 6] };
  if (rakshaDates[year]) {
    holidays[key(rakshaDates[year][0], rakshaDates[year][1])] = {
      name: "Raksha Bandhan",
      description: "Hindu festival celebrating the bond between brothers and sisters. Sisters tie a protective thread (rakhi) on their brothers' wrists.",
      type: "indian"
    };
  }
  // Janmashtami - approximate dates
  const janmashtamiDates = { 2024: [8, 26], 2025: [8, 16], 2026: [9, 4], 2027: [8, 25], 2028: [8, 14] };
  if (janmashtamiDates[year]) {
    holidays[key(janmashtamiDates[year][0], janmashtamiDates[year][1])] = {
      name: "Janmashtami",
      description: "Hindu festival celebrating the birth of Lord Krishna, the eighth avatar of Lord Vishnu. Celebrated with fasting, midnight prayers, and Dahi Handi.",
      type: "indian"
    };
  }

  // ── September ──
  const laborDay = getNthWeekday(year, 8, 1, 1); // 1st Monday of September
  holidays[key(9, laborDay)] = {
    name: "Labor Day",
    description: "US federal holiday honoring the American labor movement and workers' contributions to the country's strength and prosperity.",
    type: "us"
  };
  holidays[key(9, 5)] = {
    name: "Teachers' Day (India)",
    description: "Celebrates the birthday of Dr. Sarvepalli Radhakrishnan, honoring teachers and their contribution to society.",
    type: "indian"
  };
  // Ganesh Chaturthi - approximate dates
  const ganeshDates = { 2024: [9, 7], 2025: [8, 27], 2026: [9, 16], 2027: [9, 5], 2028: [8, 25] };
  if (ganeshDates[year]) {
    holidays[key(ganeshDates[year][0], ganeshDates[year][1])] = {
      name: "Ganesh Chaturthi",
      description: "Hindu festival celebrating the birth of Lord Ganesha, the elephant-headed god of wisdom. Features elaborate clay idols and processions.",
      type: "indian"
    };
  }

  // ── October ──
  holidays[key(10, 2)] = {
    name: "Gandhi Jayanti",
    description: "National holiday in India commemorating the birthday of Mahatma Gandhi, the Father of the Nation, and the International Day of Non-Violence.",
    type: "indian"
  };
  // Navratri / Dussehra - approximate dates
  const dussehraDates = { 2024: [10, 12], 2025: [10, 2], 2026: [10, 21], 2027: [10, 10], 2028: [9, 29] };
  if (dussehraDates[year]) {
    holidays[key(dussehraDates[year][0], dussehraDates[year][1])] = {
      name: "Dussehra / Vijayadashami",
      description: "Hindu festival celebrating the victory of Lord Rama over Ravana, symbolizing the triumph of good over evil. Marked by burning effigies of Ravana.",
      type: "indian"
    };
  }
  const colDay = getNthWeekday(year, 9, 1, 2); // 2nd Monday of October
  holidays[key(10, colDay)] = {
    name: "Columbus Day / Indigenous Peoples' Day",
    description: "US federal holiday; increasingly recognized as Indigenous Peoples' Day to honor Native American heritage and culture.",
    type: "us"
  };
  holidays[key(10, 31)] = {
    name: "Halloween",
    description: "Ancient Celtic tradition of dressing in costumes. Children go trick-or-treating and homes are decorated with pumpkins and spooky themes.",
    type: "international"
  };
  // Diwali - approximate dates
  const diwaliDates = { 2024: [11, 1], 2025: [10, 20], 2026: [11, 8], 2027: [10, 29], 2028: [10, 17] };
  if (diwaliDates[year]) {
    holidays[key(diwaliDates[year][0], diwaliDates[year][1])] = {
      name: "Diwali",
      description: "Hindu festival of lights celebrating the victory of light over darkness and good over evil. Homes are decorated with lamps, rangoli, and fireworks.",
      type: "indian"
    };
  }

  // ── November ──
  holidays[key(11, 11)] = {
    name: "Veterans Day",
    description: "US federal holiday honoring military veterans of the United States Armed Forces.",
    type: "us"
  };
  holidays[key(11, 14)] = {
    name: "Children's Day (India)",
    description: "Celebrated on the birthday of Jawaharlal Nehru, India's first Prime Minister, who was fondly known as Chacha Nehru for his love of children.",
    type: "indian"
  };
  const thanksDay = getNthWeekday(year, 10, 4, 4); // 4th Thursday of November
  holidays[key(11, thanksDay)] = {
    name: "Thanksgiving",
    description: "US holiday of giving thanks for the blessing of the harvest. Celebrated with family gatherings, turkey dinner, and gratitude.",
    type: "us"
  };

  // ── December ──
  holidays[key(12, 25)] = {
    name: "Christmas Day",
    description: "Christian holiday celebrating the birth of Jesus Christ. Worldwide celebrations include gift-giving, decorating Christmas trees, and family gatherings.",
    type: "international"
  };
  holidays[key(12, 31)] = {
    name: "New Year's Eve",
    description: "The last day of the year, celebrated with parties, countdown events, and fireworks as the world welcomes the new year.",
    type: "international"
  };
  holidays[key(12, 26)] = {
    name: "Boxing Day",
    description: "Holiday originating in the UK, traditionally a day for giving gifts to the less fortunate and service workers.",
    type: "international"
  };

  // Convert to simple format for backward compatibility
  const result = {};
  for (const [dateKey, info] of Object.entries(holidays)) {
    result[dateKey] = info;
  }
  return result;
}
