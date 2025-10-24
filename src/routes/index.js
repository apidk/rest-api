const express = require('express');
const multer = require('multer');
const { parse } = require('csv-parse');
const { Readable } = require('stream');
const router = express.Router();
const reservationsService = require('../service/ReservationsService');
const authService = require('../service/AuthService');
const { authenticateToken } = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage() });

router.get('/reservations/amenities/:amenityId', async (req, res) => {
  try {
    const { amenityId } = req.params;
    const { date } = req.query;

    // Note: in the real project the proper validation, like ajv, express-validator, etc is expected
    if (!date || date < 0) {
      return res
        .status(400)
        .json({ error: 'Date is required to be positive integer' });
    }

    const reservations =
      await reservationsService.getReservationsByAmenityAndDate(
        parseInt(amenityId),
        parseInt(date)
      );

    res.status(200).json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/reservations/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const reservations = await reservationsService.getReservationsByUser(
      parseInt(userId)
    );

    res.status(200).json(reservations);
  } catch (error) {
    console.error('Error fetching user reservations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/csv/parse', authenticateToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const records = [];
  const stream = Readable.from(req.file.buffer);

  stream
    .pipe(
      parse({
        columns: true,
        delimiter: ';',
        skip_empty_lines: true,
        trim: true,
      })
    )
    .on('data', (record) => {
      records.push(record);
    })
    .on('end', () => {
      res.status(200).json(records);
    })
    .on('error', (error) => {
      console.error('Error parsing CSV:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

router.post('/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: 'Username and password are required' });
    }

    const user = await authService.register(username, password);
    res.status(201).json(user);
  } catch (error) {
    // In a real project we want to use the custom exception classes which then can be mapped to proper response code
    if (error.message === 'Username already exists') {
      return res.status(409).json({ error: error.message });
    }
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: 'Username and password are required' });
    }

    const result = await authService.login(username, password);
    res.status(200).json(result);
  } catch (error) {
    // In a real project we want to use the custom exception classes which then can be mapped to proper response code
    if (error.message === 'Invalid credentials') {
      return res.status(401).json({ error: error.message });
    }
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
