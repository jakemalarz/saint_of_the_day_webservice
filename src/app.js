// moved from project root
const express = require('express');
const cors = require('cors');
const { validateDate } = require('./utils/dateValidator');
const app = express();
app.use(cors());

// Simple GET endpoint: /get-day-info?date=MM-DD-YYYY
const { getDayInfoByDate } = require('./utils/calendarData');

app.get('/get-day-info', (req, res) => {
  const { date } = req.query;
  const { isValid, error } = validateDate(date);
  
  if (!isValid) {
    return res.status(400).json({ error });
  }

  // Use utility to get day info
  const { entry, error: calendarError } = getDayInfoByDate(date);
  if (calendarError) {
    const status = calendarError.includes('No entry found') ? 404 : 500;
    return res.status(status).json({ error: calendarError });
  }
  res.json(entry);
});

defaultPort = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(defaultPort, () => {
    console.log(`Express app listening on port ${defaultPort}`);
  });
}

module.exports = app;
