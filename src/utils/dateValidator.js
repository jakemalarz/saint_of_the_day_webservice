/**
 * Validates if a date string is in MM-DD-YYYY format and represents a valid calendar date.
 * @param {string} dateStr - The date string to validate (expected format: MM-DD-YYYY)
 * @returns {{isValid: boolean, error?: string}} - Validation result object
 */
function validateDate(dateStr) {
  // Check if date is provided
  if (!dateStr) {
    return { isValid: false, error: 'Missing date parameter' };
  }

  // Validate date format (MM-DD-YYYY)
  const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
  if (!dateRegex.test(dateStr)) {
    return { 
      isValid: false, 
      error: 'Invalid date format. Please use MM-DD-YYYY format.' 
    };
  }

  // Parse the date and validate
  const [month, day, year] = dateStr.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  
  // Check if the date is valid
  if (
    dateObj.getFullYear() !== year ||
    dateObj.getMonth() !== month - 1 ||
    dateObj.getDate() !== day
  ) {
    return { 
      isValid: false, 
      error: 'Invalid date. Please provide a valid calendar date.' 
    };
  }

  // Only allow dates in the current year (2025)
  const CURRENT_YEAR = 2025;
  if (year !== CURRENT_YEAR) {
    return {
      isValid: false,
      error: `Only dates in the year ${CURRENT_YEAR} are accepted.`
    };
  }

  return { isValid: true };
}

module.exports = { validateDate };
