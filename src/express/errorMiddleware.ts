import * as express from 'express';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const errorMiddleware = async (error: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log('Error:', error.message);
  res.status(+error.code || 500).send({ message: error.message || 'Internal Server Error' });

  next();
};
