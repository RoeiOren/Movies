import { Response } from 'express';
import * as userService from '../services/user.service';
import { uploadFileWithMulter } from '../../common/uploadFile';
import { AuthRequest } from '../../common/authMiddleware';
import { InternalError, NotFoundError } from '../../core/Errors';
import fs from 'fs';

export const getMe = async (req: AuthRequest, res: Response) => {
  const user = await userService.getById(req.user!._id);
  if (!user) throw new NotFoundError();

  res.send(user);
};

export const update = async (req: AuthRequest, res: Response) => {
  let uploadResult: { file: Express.Multer.File; body: unknown };

  try {
    uploadResult = await uploadFileWithMulter(req, res);
  } catch (e) {
    throw new InternalError(e.message);
    return;
  }

  const user = await userService.getById(req.user._id);
  if (!user) {
    if (uploadResult?.file) fs.unlinkSync(`public/images/${uploadResult.file.filename}`);
    throw new NotFoundError();
  }

  req.body.profileImage = uploadResult.file?.filename;

  res.send(await userService.update(req.user._id, req.body));
};
