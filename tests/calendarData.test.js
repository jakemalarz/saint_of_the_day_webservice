const path = require('path');
const fs = require('fs');
const { getDayInfoByDate } = require('../src/utils/calendarData');

jest.mock('fs');

describe('getDayInfoByDate', () => {
  const mockData = [
    { date: '07-24-2025', saint: 'Saint Christina', description: 'Feast day of Saint Christina.' },
    { date: '07-25-2025', saint: 'Saint James', description: 'Feast day of Saint James.' }
  ];
  const calendarPath = path.join(__dirname, '../data/calendar.json');

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('returns the correct entry for a valid date', () => {
    fs.readFileSync.mockReturnValue(JSON.stringify(mockData));
    const result = getDayInfoByDate('07-24-2025');
    expect(result).toEqual({
      entry: mockData[0],
      error: null
    });
    expect(fs.readFileSync).toHaveBeenCalled();
  });

  it('returns error if date not found', () => {
    fs.readFileSync.mockReturnValue(JSON.stringify(mockData));
    const result = getDayInfoByDate('01-01-2025');
    expect(result).toEqual({
      entry: null,
      error: 'No entry found for the given date.'
    });
  });

  it('returns error if file read fails', () => {
    fs.readFileSync.mockImplementation(() => { throw new Error('fail'); });
    const result = getDayInfoByDate('07-24-2025');
    expect(result).toEqual({
      entry: null,
      error: 'Failed to read calendar data.'
    });
  });
});
