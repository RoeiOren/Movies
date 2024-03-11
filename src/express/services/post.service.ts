import { Types } from 'mongoose';
import { IPost, IPostPopulated } from '../../core/types/post';
import * as postRepository from '../../mongo/repositories/post.repository';
import config from '../../config/env.config';
import axios from 'axios';
import { NotFoundError } from '../../core/Errors';
import { getById as getUserById } from './user.service';
import IComment from '../../core/types/comment';

const getImdbRating = async (imdbId: string) => {
  try {
    return (await axios.get(`${config.imdbURL}/?tt=${imdbId}`)).data?.short?.aggregateRating?.ratingValue?.toString();
  } catch (error) {
    return null;
  }
};

const addIMDBRatingAndFixUser = async (post: IPostPopulated) => ({
  ...post,
  imdbRating: await getImdbRating(post.imdbId),
  user: {
    _id: post.user._id,
    email: post.user.email,
    username: post.user.username,
    ...(post.user.profileImage ? { profileImage: post.user.profileImage } : {}),
    ...(post.user.imageUrl ? { imageUrl: post.user.imageUrl } : {}),
  },
});

export const get = async () => {
  const posts = await postRepository.getByQuery({});

  const promisesResult = await Promise.allSettled(posts.map(addIMDBRatingAndFixUser));

  return promisesResult.filter((promise) => promise.status === 'fulfilled').map((promise) => (promise as { value: object }).value);
};

export const getMyPosts = async (userId: Types.ObjectId) => {
  const posts = await postRepository.findManyByUser(userId);

  const promisesResult = await Promise.allSettled(posts.map(addIMDBRatingAndFixUser));

  return promisesResult.filter((promise) => promise.status === 'fulfilled').map((promise) => (promise as { value: object }).value);
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

  const populatedPost = await addIMDBRatingAndFixUser(await postRepository.findById(id));

  const populatedComments = await Promise.allSettled(
    populatedPost.comments.map(async (comment) => {
      const user = await getUserById(comment.user as Types.ObjectId);
      if (!user) throw new Error();

      return {
        ...comment,
        user: {
          _id: user._id,
          email: user.email,
          username: user.username,
          ...(user.profileImage ? { profileImage: user.profileImage } : {}),
          ...(user.imageUrl ? { imageUrl: user.imageUrl } : {}),
        },
      };
    })
  );

  populatedPost.comments = populatedComments
    .filter((promise) => promise.status === 'fulfilled')
    .map((promise) => (promise as { value: IComment }).value);

  return populatedPost;
};

export const create = async (newPost: IPost) => {
  return postRepository.create(newPost);
};

export const deleteById = async (id: string) => {
  return postRepository.deleteOne(id);
};
