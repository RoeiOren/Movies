import { Request, Response } from 'express';
import * as userService from '../services/user.service';
// import { handleSingleUploadFile } from './../../utils/uploadFile';
import { AuthRequest } from '../../common/auth_middleware';
import { NotFoundError } from '../../core/Errors';

export const getMe = async (req: AuthRequest, res: Response) => {
  const user = await userService.getById(req.user!._id);
  if (!user) throw new NotFoundError();

  res.send(user);
};

export const update = async (req: Request, res: Response) => {
  // TODO: add image upload
  //   let uploadResult: { file: Express.Multer.File; body: unknown };

  //   try {
  //     uploadResult = await handleSingleUploadFile(req, res);
  //   } catch (e) {
  //     res.status(422).json({ errors: [e.message] });
  //     return;
  //   }

  //   req.body.profileImage = uploadResult.file?.filename;

  await userService.update(req.params.id, req.body);

  return res.status(200).send();
};
