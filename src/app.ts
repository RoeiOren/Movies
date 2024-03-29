import express, { Express, static as staticExpress } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import config from './config/env.config';
import cors from 'cors';
import logger from 'morgan';
import swaggerUI from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import authRouter from './express/routes/auth.routes';
import userRouter from './express/routes/user.routes';
import postRouter from './express/routes/post.routes';
import { errorMiddleware } from './express/errorMiddleware';

const initializeSwagger = async (app: Express) => {
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Movies Application REST API',
        version: '1.0.0',
        description: 'HTTP server including authentication using JWT and refresh token',
      },
      servers: [{ url: 'http://localhost:3000' }],
    },
    apis: ['./src/express/routes/*.ts'],
  };

  const specs = swaggerJsDoc(options);

  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));
};

const initApp = async (): Promise<Express> => {
  try {
    await mongoose.connect(config.mongo.url, { dbName: config.mongo.dbName });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.log('Error connecting to MongoDB', err.message);
    throw err;
  }

  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors({ credentials: true, origin: ['https://node63.cs.colman.ac.il:80', 'https://10.10.248.223:80'] }));
  app.use(logger('dev'));
  app.use(staticExpress('public'));

  app.use('/api/auth', authRouter);
  app.use('/api/users', userRouter);
  app.use('/api/posts', postRouter);

  initializeSwagger(app);

  app.use('*', (_req, res) => {
    res.status(404).send('Invalid Route');
  });

  app.use(errorMiddleware);

  return app;
};

export default initApp;
