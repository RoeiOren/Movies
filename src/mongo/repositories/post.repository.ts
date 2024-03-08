import { Types } from 'mongoose';
import IComment from '../../core/types/comment';
import { IPost, IPostPopulated } from '../../core/types/post';
import postModel from '../models/post.model';

export const findManyByUser = async (user: Types.ObjectId): Promise<IPostPopulated[]> => {
  return postModel.find({ user }).populate('user').populate('comments').sort({ date: -1 }).lean();
};

export const update = async (id: string, updateFields: { content?: string }) => {
  return postModel.updateOne({ _id: new Types.ObjectId(id) }, updateFields, { new: true });
};

export const remove = async (id: string) => {
  return postModel.deleteOne({ _id: new Types.ObjectId(id) });
};

export const addComment = async (postId: string, comment: IComment) => {
  return postModel.updateOne({ _id: new Types.ObjectId(postId) }, { $push: { comments: comment } });
};

export const findById = async (id: Types.ObjectId): Promise<IPostPopulated> => {
  return postModel.findById(id).populate('user').populate('comments').sort({ date: -1 }).lean();
};

export const create = async (post: IPost) => {
  return postModel.create(post);
};

export const getByPagination = async (query: object, page: number, limit: number): Promise<IPostPopulated[]> => {
  return postModel
    .find(query)
    .populate('user')
    .populate('comments')
    .skip((page - 1) * limit)
    .sort({ date: -1 })
    .limit(limit)
    .lean();
};

export const deleteOne = async (id: string) => {
  return postModel.deleteOne({ _id: new Types.ObjectId(id) });
};
