import { Response } from 'express';
import * as postService from '../services/post.service';
import { AuthRequest } from '../../common/auth_middleware';
import { NotFoundError, forbiddenError } from '../../core/Errors';

export const get = async (req: AuthRequest, res: Response) => {
  const { page, limit } = req.query;
  if (!+page || !+limit) {
    return res.status(400).send('Missing page or limit');
  }

  res.send(await postService.getByPagination(+page, +limit));
};

export const getMyPosts = async (req: AuthRequest, res: Response) => {
  res.send(await postService.getMyPosts(req.user!._id));
};

export const updateById = async (req: AuthRequest, res: Response) => {
  const post = await postService.getById(req.params.id);
  if (!post) {
    throw new NotFoundError('Post not found');
  }

  if (post.user._id.toString !== req.user!._id.toString) {
    throw new forbiddenError('You are not the owner of this post');
  }

  if (Object.keys(req.body).length > 1 || !req.body.content) {
    throw new forbiddenError('You can only update the content');
  }

  await postService.updateById(req.params.id, req.body);
  res.send('OK');
};

export const addComment = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { content } = req.body;
  if (!content) {
    return res.status(400).send('Missing content');
  }

  await postService.addComment(id, req.user._id, content);
  res.send('OK');
};

export const getById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).send('Missing URL parameter: id');
  }

  res.send(await postService.getById(id));
};

export const create = async (req: AuthRequest, res: Response) => {
  // TODO: add image upload
  const { movieName, description, imdbId } = req.body;

  if (!movieName || !description || !imdbId) {
    return res.status(400).send('Missing one of the properties: movieName, description, or imdbId');
  }

  return res.send(
    await postService.create({
      movieName: movieName,
      content: description,
      user: req.user!._id,
      imdbId,
      comments: [],
      date: new Date(),
    })
  );
};

export const deleteById = async (req: AuthRequest, res: Response) => {
  const post = await postService.getById(req.params.id);
  if (!post) {
    return res.status(404).send('Post not found');
  }

  if (post.user._id.toString !== req.user!._id.toString) {
    return res.status(403).send('You are not the owner of this post');
  }

  await postService.deleteById(req.params.id);
  res.send('OK');
};
