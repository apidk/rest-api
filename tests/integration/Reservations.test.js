const request = require('supertest');
const express = require('express');
const { sequelize, Amenity, Reservation } = require('../../src/db/models');
const apiRoutes = require('../../src/routes');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiRoutes);

describe('Reservations API', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });

    await Amenity.create({
      id: 1,
      name: 'Massage room',
    });

    await Amenity.create({
      id: 2,
      name: 'Gym',
    });

    await Reservation.bulkCreate([
      {
        id: 1,
        amenityId: 1,
        userId: 2,
        startTime: 300,
        endTime: 480,
        date: '1593648000000',
      },
      {
        id: 2,
        amenityId: 1,
        userId: 3,
        startTime: 600,
        endTime: 720,
        date: '1593648000000',
      },
      {
        id: 3,
        amenityId: 2,
        userId: 4,
        startTime: 360,
        endTime: 420,
        date: '1593820800000',
      },
      {
        id: 4,
        amenityId: 1,
        userId: 2,
        startTime: 420,
        endTime: 600,
        date: '1593820800000',
      },
      {
        id: 5,
        amenityId: 2,
        userId: 2,
        startTime: 720,
        endTime: 900,
        date: '1593820800000',
      },
    ]);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('GET /api/reservations/amenities/:amenityId', () => {
    it('should return reservations for amenity on specific date', async () => {
      const response = await request(app)
        .get('/api/reservations/amenities/1')
        .query({ date: 1593648000 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toMatchObject({
        reservationId: 1,
        userId: 2,
        startTime: '05:00',
        duration: 180,
        amenityName: 'Massage room',
      });
      expect(response.body[1]).toMatchObject({
        reservationId: 2,
        userId: 3,
        startTime: '10:00',
        duration: 120,
        amenityName: 'Massage room',
      });
    });

    it('should return empty array when no reservations found', async () => {
      const response = await request(app)
        .get('/api/reservations/amenities/1')
        .query({ date: 9999999999 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(0);
    });

    it('should return 400 when date parameter is missing', async () => {
      const response = await request(app).get('/api/reservations/amenities/1');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should sort reservations by start time ascending', async () => {
      const response = await request(app)
        .get('/api/reservations/amenities/1')
        .query({ date: 1593648000 });

      expect(response.status).toBe(200);
      expect(response.body[0].startTime).toBe('05:00');
      expect(response.body[1].startTime).toBe('10:00');
    });

    it('should not allow the timestamp with negative value in the query', async () => {
      const response = await request(app)
        .get('/api/reservations/amenities/1')
        .query({ date: -1 });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/reservations/users/:userId', () => {
    it('should return reservations for user grouped by days', async () => {
      const response = await request(app).get('/api/reservations/users/2');

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(Object.keys(response.body)).toHaveLength(2);
      expect(response.body).toHaveProperty('1593648000000');
      expect(response.body).toHaveProperty('1593820800000');
    });

    it('should return correct reservation data grouped by date', async () => {
      const response = await request(app).get('/api/reservations/users/2');

      expect(response.status).toBe(200);

      const day1 = response.body['1593648000000'];
      expect(day1).toHaveLength(1);
      expect(day1[0]).toMatchObject({
        reservationId: 1,
        amenityId: 1,
        startTime: '05:00',
        duration: 180,
      });

      const day2 = response.body['1593820800000'];
      expect(day2).toHaveLength(2);
      expect(day2[0]).toMatchObject({
        reservationId: 4,
        amenityId: 1,
        startTime: '07:00',
        duration: 180,
      });
      expect(day2[1]).toMatchObject({
        reservationId: 5,
        amenityId: 2,
        startTime: '12:00',
        duration: 180,
      });
    });

    it('should return empty object when user has no reservations', async () => {
      const response = await request(app).get('/api/reservations/users/999');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({});
    });

    it('should sort reservations within each day by start time', async () => {
      const response = await request(app).get('/api/reservations/users/2');

      expect(response.status).toBe(200);

      const day2 = response.body['1593820800000'];
      expect(day2[0].startTime).toBe('07:00');
      expect(day2[1].startTime).toBe('12:00');
    });
  });
});
