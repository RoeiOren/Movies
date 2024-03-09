import { Types } from 'mongoose';
import { IPost, IPostPopulated } from '../../core/types/post';
import * as postRepository from '../../mongo/repositories/post.repository';
import config from '../../config/env.config';
import axios from 'axios';
import { NotFoundError } from '../../core/Errors';

const addIMDBRatingAndFixUser = async (post: IPostPopulated) => ({
  ...post,
  imdbRating: (await axios.get(`${config.imdbURL}/?tt=${post.imdbId}`)).data.short.review.reviewRating.ratingValue.toString(),
  user: {
    _id: post.user._id,
    email: post.user.email,
    username: post.user.username,
    ...(post.user.profileImage ? { profileImage: post.user.profileImage } : {}),
  },
});

export const get = async () => {
  const posts = await postRepository.getByQuery({});

  const promisesResult = await Promise.allSettled(posts.map(addIMDBRatingAndFixUser));

  return promisesResult.map((promise) => (promise as { value: object }).value);
};

export const getMyPosts = async (userId: Types.ObjectId) => {
  const posts = await postRepository.findManyByUser(userId);

  const promisesResult = await Promise.allSettled(posts.map(addIMDBRatingAndFixUser));

  return promisesResult.map((promise) => (promise as { value: object }).value);
};

export const updateById = (id: string, updateFields: { content?: string }) => {
  return postRepository.update(id, updateFields);
};

export const addComment = async (postId: string, userId: Types.ObjectId, content: string) => {
  return postRepository.addComment(postId, { user: userId, content, date: new Date() });
};

export const getById = async (id: Types.ObjectId) => {
  const post = await postRepository.findById(id);
  if (!post) throw new NotFoundError('Post not found');
  return addIMDBRatingAndFixUser(await postRepository.findById(id));
};

export const create = async (newPost: IPost) => {
  return postRepository.create(newPost);
};

export const deleteById = async (id: string) => {
  return postRepository.deleteOne(id);
};
