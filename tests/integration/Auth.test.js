const request = require('supertest');
const express = require('express');
const { sequelize } = require('../../src/db/models');
const apiRoutes = require('../../src/routes');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiRoutes);

describe('Authentication API', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app).post('/api/auth/register').send({
        username: 'testuser',
        password: 'password123',
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('username', 'testuser');
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 400 when username is missing', async () => {
      const response = await request(app).post('/api/auth/register').send({
        password: 'password123',
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 when password is missing', async () => {
      const response = await request(app).post('/api/auth/register').send({
        username: 'testuser2',
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 409 when username already exists', async () => {
      await request(app).post('/api/auth/register').send({
        username: 'duplicate',
        password: 'password123',
      });

      const response = await request(app).post('/api/auth/register').send({
        username: 'duplicate',
        password: 'password456',
      });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error', 'Username already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeAll(async () => {
      await request(app).post('/api/auth/register').send({
        username: 'loginuser',
        password: 'password123',
      });
    });

    it('should login with valid credentials', async () => {
      const response = await request(app).post('/api/auth/login').send({
        username: 'loginuser',
        password: 'password123',
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('id');
    });

    it('should return 401 with invalid password', async () => {
      const response = await request(app).post('/api/auth/login').send({
        username: 'loginuser',
        password: 'wrongpassword',
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Invalid credentials');
    });

    it('should return 401 with non-existent username', async () => {
      const response = await request(app).post('/api/auth/login').send({
        username: 'nonexistent',
        password: 'password123',
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Invalid credentials');
    });

    it('should return 400 when username is missing', async () => {
      const response = await request(app).post('/api/auth/login').send({
        password: 'password123',
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 when password is missing', async () => {
      const response = await request(app).post('/api/auth/login').send({
        username: 'loginuser',
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
});
