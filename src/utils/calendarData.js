const path = require('path');
const fs = require('fs');

/**
 * Reads the calendar.json file and finds the entry for the given date.
 * @param {string} date - Date string in MM-DD-YYYY format
 * @returns {{entry: object|null, error: string|null}}
 */
function getDayInfoByDate(date) {
  const calendarPath = path.join(__dirname, '../data/calendar.json');
  let calendarArr;
  try {
    const data = fs.readFileSync(calendarPath, 'utf8');
    calendarArr = JSON.parse(data);
  } catch (err) {
    return { entry: null, error: 'Failed to read calendar data.' };
  }

  const entry = calendarArr.find(obj => obj.date === date);
  if (!entry) {
    return { entry: null, error: 'No entry found for the given date.' };
  }
  return { entry, error: null };
}

module.exports = { getDayInfoByDate };
