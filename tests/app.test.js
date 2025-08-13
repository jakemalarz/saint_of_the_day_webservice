const request = require('supertest');
const app = require('../src/app');

// Mock the date validator and calendar data util
jest.mock('../src/utils/dateValidator');
jest.mock('../src/utils/calendarData');
const { validateDate } = require('../src/utils/dateValidator');
const { getDayInfoByDate } = require('../src/utils/calendarData');

describe('GET /get-day-info', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if date is missing', async () => {
    validateDate.mockReturnValue({ isValid: false, error: 'Missing date parameter' });
    const res = await request(app).get('/get-day-info');
    expect(validateDate).toHaveBeenCalledWith(undefined);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: 'Missing date parameter' });
  });

  it('should return 400 for invalid date', async () => {
    validateDate.mockReturnValue({ isValid: false, error: 'Invalid date format' });
    const res = await request(app).get('/get-day-info?date=bad-date');
    expect(validateDate).toHaveBeenCalledWith('bad-date');
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid date format' });
  });

  it('should return 500 if calendar data read fails', async () => {
    validateDate.mockReturnValue({ isValid: true });
    getDayInfoByDate.mockReturnValue({ entry: null, error: 'Failed to read calendar data.' });
    const res = await request(app).get('/get-day-info?date=07-24-2025');
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: 'Failed to read calendar data.' });
  });

  it('should return 404 if date not found', async () => {
    validateDate.mockReturnValue({ isValid: true });
    getDayInfoByDate.mockReturnValue({ entry: null, error: 'No entry found for the given date.' });
    const res = await request(app).get('/get-day-info?date=01-01-2025');
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: 'No entry found for the given date.' });
  });

  it('should return 200 and the calendar entry for a valid date', async () => {
    const testDate = '07-24-2025';
    const fakeEntry = { date: testDate, saint: 'Saint Christina', description: 'Feast day.' };
    validateDate.mockReturnValue({ isValid: true });
    getDayInfoByDate.mockReturnValue({ entry: fakeEntry, error: null });
    const res = await request(app).get(`/get-day-info?date=${testDate}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(fakeEntry);
  });

  // Root route should use the same handler behavior
  it('root / should return 400 if date is missing', async () => {
    validateDate.mockReturnValue({ isValid: false, error: 'Missing date parameter' });
    const res = await request(app).get('/');
    expect(validateDate).toHaveBeenCalledWith(undefined);
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: 'Missing date parameter' });
  });

  it('root / should return 200 and the calendar entry for a valid date', async () => {
    const testDate = '12-25-2025';
    const fakeEntry = { date: testDate, saint: 'Nativity of the Lord', description: 'Christmas.' };
    validateDate.mockReturnValue({ isValid: true });
    getDayInfoByDate.mockReturnValue({ entry: fakeEntry, error: null });
    const res = await request(app).get(`/?date=${testDate}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(fakeEntry);
  });
});
