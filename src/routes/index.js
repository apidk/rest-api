const express = require('express');
const router = express.Router();
const reservationsService = require('../service/ReservationsService');

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

router.post(
  '/csv/parse',
  /* authenticateToken, */ (req, res) => {
    res.status(200).json({ message: 'In progress' });
  }
);

router.post('/auth/register', (req, res) => {
  res.status(200).json({ message: 'In progress' });
});

router.post('/auth/login', (req, res) => {
  res.status(200).json({ message: 'In progress' });
});

module.exports = router;
