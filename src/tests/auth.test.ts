import request from 'supertest';
import initApp from '../app';
import mongoose from 'mongoose';
import { Express } from 'express';
import userModel from '../mongo/models/user.model';

let app: Express;
const user = {
  email: 'testUser@test.com',
  password: '1234567890',
  username: 'testUser',
};

beforeAll(async () => {
  app = await initApp();
  console.log('beforeAll');
  await userModel.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

let accessToken: string;
let refreshToken: string;
let newRefreshToken: string;

describe('Auth tests', () => {
  test('Test Register', async () => {
    const response = await request(app).post('/api/auth/register').send(user);
    expect(response.statusCode).toBe(200);
  });

  test('Test Register exist email', async () => {
    const response = await request(app).post('/api/auth/register').send(user);
    expect(response.statusCode).toBe(400);
  });

  test('Test Register missing password', async () => {
    const response = await request(app).post('/api/auth/register').send({
      email: 'test@test.com',
    });
    expect(response.statusCode).toBe(400);
  });

  test('Test Login', async () => {
    const response = await request(app).post('/api/auth/login').send(user);
    expect(response.statusCode).toBe(200);
    accessToken = response.body.accessToken;
    refreshToken = response.body.refreshToken;
    expect(accessToken).toBeDefined();
  });

  test('Test login missing email', async () => {
    const response = await request(app).post('/api/auth/login').send({
      password: '1234567890',
    });
    expect(response.statusCode).toBe(400);
  });

  test('Test Login wrong password', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: user.email,
      password: 'wrongPassword',
    });
    expect(response.statusCode).toBe(401);
  });

  test('Test forbidden access without token', async () => {
    const response = await request(app).get('/api/users/me');
    expect(response.statusCode).toBe(401);
  });

  test('Test access with valid token', async () => {
    const response = await request(app).get('/api/users/me').set('Authorization', `Bearer ${accessToken}`);
    expect(response.statusCode).toBe(200);
  });

  test('Test access with invalid token', async () => {
    const response = await request(app).get('/api/users/me').set('Authorization', `Bearer 1${accessToken}`);
    expect(response.statusCode).toBe(401);
  });

  jest.setTimeout(10000);

  test('Test access after timeout of token', async () => {
    await new Promise((resolve) => setTimeout(() => resolve('done'), 5000));

    const response = await request(app).get('/api/users').set('Authorization', `Bearer ${accessToken}`);
    expect(response.statusCode).not.toBe(200);
  });

  test('Test refresh token', async () => {
    const response = await request(app).get('/api/auth/refresh').set('Authorization', `Bearer ${refreshToken}`).send();
    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();

    const newAccessToken = response.body.accessToken;
    newRefreshToken = response.body.refreshToken;

    const response2 = await request(app).get('/api/users/me').set('Authorization', `Bearer ${newAccessToken}`);
    expect(response2.statusCode).toBe(200);
  });

  test('Test double use of refresh token', async () => {
    const response = await request(app).get('/api/auth/refresh').set('Authorization', `Bearer ${refreshToken}`).send();
    expect(response.statusCode).not.toBe(200);

    //verify that the new token is not valid as well
    const response1 = await request(app).get('/api/auth/refresh').set('Authorization', `Bearer ${newRefreshToken}`).send();
    expect(response1.statusCode).not.toBe(200);
  });

  test('Test logout', async () => {
    const response1 = await request(app).post('/api/auth/login').send(user);
    refreshToken = response1.body.refreshToken;

    const response = await request(app).get('/api/auth/logout').set('Authorization', `Bearer ${refreshToken}`).send();
    expect(response.statusCode).toBe(200);
    expect(response.body.refreshTokens.length).toBe(0);
  });
});
