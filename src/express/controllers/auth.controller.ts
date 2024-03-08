import { uploadFileWithMulter } from '../../common/uploadFile';
import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import IUser from '../../core/types/user';
import { OAuth2Client } from 'google-auth-library';
import config from '../../config/env.config';
import { Types } from 'mongoose';
import { AuthenticationError, BadRequestError, InternalError } from '../../core/Errors';
import fs from 'fs';

const client = new OAuth2Client();

export const register = async (req: Request, res: Response) => {
  let uploadResult: { file: Express.Multer.File; body: unknown } | undefined;

  try {
    uploadResult = await uploadFileWithMulter(req, res);
  } catch (error) {
    throw new InternalError(error.message);
  }

  const { email, password, username } = req.body;
  if (!email || !password || !username) {
    if (uploadResult) fs.unlinkSync(`public/images/${uploadResult?.file?.filename}`);
    throw new BadRequestError('missing one of the properties: email, password or username');
  }

  let userExists = await userService.getByEmail(email);
  if (userExists) {
    if (uploadResult) fs.unlinkSync(`public/images/${uploadResult?.file?.filename}`);
    throw new BadRequestError('email already exists');
  }

  userExists = await userService.getByUsername(username);
  if (userExists) {
    if (uploadResult) fs.unlinkSync(`public/images/${uploadResult?.file?.filename}`);
    throw new BadRequestError('username already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const encryptedPassword = await bcrypt.hash(password, salt);
  const user = await userService.create({ email, password: encryptedPassword, username, profileImage: uploadResult?.file?.filename });
  res.send(user);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('missing email or password');
  }

  const user: IUser | null = await userService.getByEmail(email);
  if (!user) {
    throw new AuthenticationError('email or password are incorrect');
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new AuthenticationError('email or password are incorrect');
  }

  const accessToken = jwt.sign({ _id: user._id }, config.jwt.secret, { expiresIn: config.jwt.expiration });
  const refreshToken = jwt.sign({ _id: user._id }, config.jwt.refreshSecret);
  await userService.addRefreshToken(user._id.toString(), refreshToken);

  return res.send({ accessToken, refreshToken });
};

export const logout = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const refreshToken = authHeader && authHeader.split(' ')[1]; // Bearer <token>
  if (!refreshToken) throw new AuthenticationError();

  try {
    const user = jwt.verify(refreshToken, config.jwt.refreshSecret) as { _id: string };
    const userDb = await userService.getById(new Types.ObjectId(user._id));

    if (!userDb.refreshTokens || !userDb.refreshTokens.includes(refreshToken)) {
      await userService.resetRefreshTokens(user._id);
      throw new AuthenticationError();
    } else {
      await userService.removeRefreshToken(user._id, refreshToken);
      return res.sendStatus(200);
    }
  } catch (err) {
    throw new AuthenticationError();
  }
};

export const refresh = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const refreshToken = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!refreshToken) throw new AuthenticationError();

  try {
    const user = jwt.verify(refreshToken, config.jwt.refreshSecret) as { _id: string };
    const userDb = await userService.getById(new Types.ObjectId(user._id));

    if (!userDb.refreshTokens || !userDb.refreshTokens.includes(refreshToken)) {
      await userService.resetRefreshTokens(user._id);
      throw new AuthenticationError();
    }

    const accessToken = jwt.sign({ _id: user._id }, config.jwt.secret, { expiresIn: config.jwt.expiration });
    const newRefreshToken = jwt.sign({ _id: user._id }, config.jwt.refreshSecret);
    await userService.removeRefreshToken(user._id, refreshToken);
    await userService.addRefreshToken(user._id, newRefreshToken);

    return res.send({
      accessToken: accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    throw new AuthenticationError();
  }
};

export const loginWithGoogle = async (req: Request, res: Response) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: config.googleClientId,
    });

    const payload = ticket.getPayload();

    let user: IUser | null = await userService.getByEmail(payload?.email);

    if (!user) {
      user = await userService.create({ email: payload?.email, username: payload?.name });
    }

    const accessToken = jwt.sign({ _id: user._id }, config.jwt.secret, { expiresIn: config.jwt.expiration });
    const refreshToken = jwt.sign({ _id: user._id }, config.jwt.refreshSecret);
    await userService.addRefreshToken(user._id.toString(), refreshToken);

    res.send({ accessToken, refreshToken });
  } catch (err) {
    throw new InternalError('Error verifying google token');
  }
};
