import { Express } from 'express';
import request from 'supertest';
import initApp from '../app';
import mongoose from 'mongoose';
import postModel from '../mongo/models/post.model';
import userModel from '../mongo/models/user.model';
import IUser from '../core/types/user';
import { IPost } from '../core/types/post';

let app: Express;
const user: IUser = {
  email: 'test@student.post.test',
  password: '1234567890',
  username: 'testUser',
};

const post1: IPost = {
  movieName: 'The Maze Runner',
  user: user._id,
  content: 'This is a great movie',
  comments: [],
  imdbId: 'tt1790864',
  date: new Date(),
};

let accessToken = '';

beforeAll(async () => {
  app = await initApp();
  console.log('beforeAll');
  await postModel.deleteMany();

  await userModel.deleteMany({});
  const response = await request(app).post('/auth/register').send(user);
  user._id = response.body._id;
  const response2 = await request(app).post('/auth/login').send(user);
  accessToken = response2.body.accessToken;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Post tests', () => {
  test('Test create post', async () => {
    const res = await request(app).post('/posts').set('Authorization', `Bearer ${accessToken}`).send(post1);
    expect(res.statusCode).toBe(200);
    expect(res.body.movieName).toBe(post1.movieName);
    post1._id = res.body._id;
  });

  test('Test create post missing property', async () => {
    const res = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ movieName: post1.movieName, content: post1.content });
    expect(res.statusCode).toBe(400);
  });

  test('Test get posts', async () => {
    const res = await request(app).get('/posts');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  test('Test get my posts', async () => {
    const res = await request(app).get('/posts/my').set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  test('Test get my posts without token', async () => {
    const res = await request(app).get('/posts/my');
    expect(res.statusCode).toBe(401);
  });

  test('Test get by id', async () => {
    const res = await request(app).get(`/posts/${post1._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.movieName).toBe(post1.movieName);
  });

  test('Test update post', async () => {
    const res = await request(app)
      .patch(`/posts/${post1._id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ content: `Didn't like it at all` });
    expect(res.statusCode).toBe(200);
    expect(res.body.content).toBe(`Didn't like it at all`);
  });

  test('Test add comment', async () => {
    const res = await request(app).put(`/posts/${post1._id}/comment`).set('Authorization', `Bearer ${accessToken}`).send({ content: 'I disagree' });
    expect(res.statusCode).toBe(200);
    expect(res.body.comments.length).toBe(1);
  });

  test('Test Delete post', async () => {
    const res = await request(app).delete(`/posts/${post1._id}`).set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(200);
    const res2 = await request(app).get(`/posts/${post1._id}`);
    expect(res2.statusCode).toBe(404);
  });
});
