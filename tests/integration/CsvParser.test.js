const request = require('supertest');
const express = require('express');
const { sequelize } = require('../../src/db/models');
const apiRoutes = require('../../src/routes');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiRoutes);

describe('CSV Parser API', () => {
  let authToken;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    await request(app).post('/api/auth/register').send({
      username: 'csvtestuser',
      password: 'password123',
    });

    const loginResponse = await request(app).post('/api/auth/login').send({
      username: 'csvtestuser',
      password: 'password123',
    });

    authToken = loginResponse.body.token;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/csv/parse', () => {
    it('should parse CSV file and return JSON', async () => {
      const response = await request(app)
        .post('/api/csv/parse')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', 'tests/fixtures/test-data.csv');

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(3);
      expect(response.body[0]).toMatchObject({
        name: 'John Doe',
        age: '30',
        email: 'john@example.com',
      });
      expect(response.body[1]).toMatchObject({
        name: 'Jane Smith',
        age: '25',
        email: 'jane@example.com',
      });
      expect(response.body[2]).toMatchObject({
        name: 'Bob Johnson',
        age: '35',
        email: 'bob@example.com',
      });
    });

    it('should handle CSV with only headers', async () => {
      const response = await request(app)
        .post('/api/csv/parse')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', 'tests/fixtures/empty.csv');

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(0);
    });

    it('should return 401 when no token is provided', async () => {
      const response = await request(app)
        .post('/api/csv/parse')
        .attach('file', 'tests/fixtures/test-data.csv');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 when no file is uploaded but token is valid', async () => {
      const response = await request(app)
        .post('/api/csv/parse')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
});