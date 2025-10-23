const request = require('supertest');
const express = require('express');
const apiRoutes = require('../../src/routes');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiRoutes);

describe('CSV Parser API', () => {
  describe('POST /api/csv/parse', () => {
    it('should parse CSV file and return JSON', async () => {
      const response = await request(app)
        .post('/api/csv/parse')
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
        .attach('file', 'tests/fixtures/empty.csv');

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(0);
    });

    it('should return 400 when no file is uploaded', async () => {
      const response = await request(app).post('/api/csv/parse');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
});