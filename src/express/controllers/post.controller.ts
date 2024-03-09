import { uploadFileWithMulter } from '../../common/uploadFile';
import { Response } from 'express';
import * as postService from '../services/post.service';
import { AuthRequest } from '../../common/authMiddleware';
import { BadRequestError, InternalError, NotFoundError, forbiddenError } from '../../core/Errors';
import fs from 'fs';
import { Types } from 'mongoose';

export const get = async (_req: AuthRequest, res: Response) => {
  res.send(await postService.get());
};

export const getMyPosts = async (req: AuthRequest, res: Response) => {
  res.send(await postService.getMyPosts(req.user!._id));
};

export const updateById = async (req: AuthRequest, res: Response) => {
  const post = await postService.getById(new Types.ObjectId(req.params.id));
  if (!post) {
    throw new NotFoundError('Post not found');
  }

  if (post.user._id.toString !== req.user!._id.toString) {
    throw new forbiddenError('You are not the owner of this post');
  }

  if (Object.keys(req.body).length > 1 || !req.body.content) {
    throw new forbiddenError('You can only update the content');
  }

  res.send(await postService.updateById(req.params.id, req.body));
};

export const addComment = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { content } = req.body;
  if (!content) {
    throw new BadRequestError('Missing content');
  }

  res.send(await postService.addComment(id, req.user._id, content));
};

export const getById = async (req: AuthRequest, res: Response) => {
  res.send(await postService.getById(new Types.ObjectId(req.params.id)));
};

export const create = async (req: AuthRequest, res: Response) => {
  let uploadResult: { file: Express.Multer.File; body: unknown } | undefined;

  try {
    uploadResult = await uploadFileWithMulter(req, res);
  } catch (error) {
    throw new InternalError(error.message);
  }

  const { movieName, content, imdbId } = req.body;

  if (!movieName || !content || !imdbId) {
    if (uploadResult?.file) fs.unlinkSync(`public/images/${uploadResult.file.filename}`);
    throw new BadRequestError('Missing one of the properties: movieName, content, or imdbId');
  }

  return res.send(
    await postService.create({
      movieName: movieName,
      content,
      user: req.user!._id,
      imageName: uploadResult.file?.filename,
      imdbId,
      comments: [],
      date: new Date(),
    })
  );
};

export const deleteById = async (req: AuthRequest, res: Response) => {
  const post = await postService.getById(new Types.ObjectId(req.params.id));
  if (!post) {
    throw new NotFoundError('Post not found');
  }

  if (post.user._id.toString !== req.user!._id.toString) {
    throw new forbiddenError('You are not the owner of this post');
  }

  res.send(await postService.deleteById(req.params.id));
};
