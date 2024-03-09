import { Types } from 'mongoose';
import IUser from '../../core/types/user';
import userModel from '../models/user.model';

export const findByEmail = async (email: string) => {
  return userModel.findOne({ email }).lean();
};

export const create = async (user: IUser) => {
  return userModel.create(user);
};

export const updatePassword = async (id: Types.ObjectId, password: string) => {
  return userModel.findOneAndUpdate({ _id: id }, { password }).lean();
};

export const findById = async (id: Types.ObjectId) => {
  return userModel.findById(id).lean();
};

export const update = async (id: Types.ObjectId, updatedField: { username?: string; email?: string; password?: string }) => {
  return userModel.findOneAndUpdate({ _id: id }, updatedField, { new: true });
};

export const findByUsername = async (username: string) => {
  return userModel.findOne({ username }).lean();
};

export const addRefreshToken = async (id: string, refreshToken: string) => {
  return userModel.findOneAndUpdate({ _id: new Types.ObjectId(id) }, { $push: { refreshTokens: refreshToken } });
};

export const resetRefreshTokens = async (id: string) => {
  return userModel.findOneAndUpdate({ _id: new Types.ObjectId(id) }, { refreshTokens: [] });
};
export const removeRefreshToken = async (id: string, refreshToken: string) => {
  return userModel.findOneAndUpdate({ _id: new Types.ObjectId(id) }, { $pull: { refreshTokens: refreshToken } }, { new: true });
};
