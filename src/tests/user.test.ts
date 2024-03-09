import request from 'supertest';
import initApp from '../app';
import mongoose from 'mongoose';
import { Express } from 'express';
import userModel from '../mongo/models/user.model';
import IUser from '../core/types/user';

let app: Express;
let accessToken: string;

const user: IUser = {
  email: 'testUser@test.com',
  password: '1234567890',
  username: 'testUser',
};

beforeAll(async () => {
  app = await initApp();
  console.log('beforeAll');
  await userModel.deleteMany({});

  await request(app).post('/api/auth/register').send(user);
  const response = await request(app).post('/api/auth/login').send(user);
  accessToken = response.body.accessToken;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Users tests', () => {
  test('Test get my user', async () => {
    const res = await request(app).get('/api/users/me').set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe(user.email);
    expect(res.body.username).toBe(user.username);
  });

  test('Test get my user invalid authorization', async () => {
    const res = await request(app).get('/api/users/me').set('Authorization', `Bearer 1${accessToken}`);
    expect(res.statusCode).toBe(401);
  });

  test('Test update user', async () => {
    const res = await request(app).patch('/api/users').set('Authorization', `Bearer ${accessToken}`).send({ username: 'newUsername' });
    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe('newUsername');
  });
});
