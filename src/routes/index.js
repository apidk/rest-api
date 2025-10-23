const express = require('express');
const router = express.Router();

router.get('/reservations/amenity/:amenityId', (req, res) => {
  res.status(200).json({ message: 'In progress' });
});

router.get('/reservations/user/:userId', (req, res) => {
  res.status(200).json({ message: 'In progress' });
});

router.post('/csv/parse', /* authenticateToken, */ (req, res) => {
  res.status(200).json({ message: 'In progress' });
});

router.post('/auth/register', (req, res) => {
  res.status(200).json({ message: 'In progress' });
});

router.post('/auth/login', (req, res) => {
  res.status(200).json({ message: 'In progress' });
});

module.exports = router;
