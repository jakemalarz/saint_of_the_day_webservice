const { validateDate } = require('../src/utils/dateValidator');

describe('validateDate', () => {
  it('should return error for missing date', () => {
    const result = validateDate();
    expect(result).toEqual({
      isValid: false,
      error: 'Missing date parameter'
    });
  });

  it('should return error for invalid date formats', () => {
    const testCases = [
      { input: '2025-07-24', description: 'YYYY-MM-DD' },
      { input: '24-07-2025', description: 'DD-MM-YYYY' },
      { input: '7-24-2025', description: 'M-D-YYYY' },
      { input: '07/24/2025', description: 'MM/DD/YYYY' },
      { input: 'invalid-date', description: 'invalid text' },
      { input: '12345678', description: 'numeric string' },
    ];

    testCases.forEach(({ input, description }) => {
      const result = validateDate(input);
      expect(result).toMatchObject({
        isValid: false,
      });
      // Just verify that an error message exists and is a string
      expect(result.error).toBeDefined();
      expect(typeof result.error).toBe('string');
    });
  });

  it('should return error for invalid calendar dates', () => {
    const invalidDates = [
      '02-30-2023', // February 30th doesn't exist
      '13-01-2023', // Month 13 doesn't exist
      '00-15-2023', // Month 0 doesn't exist
      '05-00-2023', // Day 0 doesn't exist
      '02-29-2023', // Not a leap year
    ];

    invalidDates.forEach(date => {
      const result = validateDate(date);
      expect(result).toEqual({
        isValid: false,
        error: 'Invalid date. Please provide a valid calendar date.'
      });
    });
  });

  it('should return error for dates not in 2025', () => {
    const not2025 = [
      '01-01-2023', // past year
      '02-28-2024', // past year
      '02-29-2024', // leap year
      '07-04-2026', // future year
      '12-31-2030', // far future
    ];

    not2025.forEach(date => {
      const result = validateDate(date);
      expect(result).toEqual({
        isValid: false,
        error: 'Only dates in the year 2025 are accepted.'
      });
    });
  });

  it('should return valid for correct 2025 dates', () => {
    const validDates = [
      '01-01-2025', // January 1, 2025
      '02-28-2025', // February 28, 2025
      '07-04-2025', // July 4, 2025
      '12-31-2025', // December 31, 2025
    ];

    validDates.forEach(date => {
      const result = validateDate(date);
      expect(result).toEqual({ isValid: true });
    });
  });
});
