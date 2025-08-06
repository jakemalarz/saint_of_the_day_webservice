# Saint of the Day

A simple Node.js REST API using Express.js, deployable to AWS Lambda.

## Local Development

```bash
npm install
npm run dev
```

Visit: http://localhost:3000/get-day-info?date=2025-07-24

## Deploy to AWS Lambda

This project uses the Serverless Framework. Install it globally if you haven't:

```bash
npm install -g serverless
```

Deploy:

```bash
serverless deploy
```

## Endpoint

- `GET /get-day-info?date=MM-DD-YYYY` — Returns the calendar entry for the given date (must be in the current year, 2025).

### Query Parameters
- `date` (required): The date to query, in `MM-DD-YYYY` format. **Only dates in the year 2025 are accepted.**

### Responses
- **200 OK**: Returns the full calendar object for the given date, e.g.
  ```json
  {
    "date": "07-24-2025",
    "saint": "Saint Christina the Astonishing",
    "description": "Feast day of Saint Christina."
  }
  ```
- **400 Bad Request**: If the date is missing, in the wrong format, not a valid calendar date, or not in 2025.
  ```json
  { "error": "Invalid date format. Please use MM-DD-YYYY format." }
  { "error": "Only dates in the year 2025 are accepted." }
  ```
- **404 Not Found**: If there is no entry for the given date.
  ```json
  { "error": "No entry found for the given date." }
  ```
- **500 Internal Server Error**: If the calendar data cannot be read.
  ```json
  { "error": "Failed to read calendar data." }
  ```
