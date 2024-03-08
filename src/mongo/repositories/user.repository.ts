import { Types } from 'mongoose';
import IUser from '../../core/types/user';
import userModel from '../models/user.model';

export const findByEmail = async (email: string) => {
  return userModel.findOne({ email }).lean();
};

export const create = async (user: IUser) => {
  return userModel.create(user);
};

export const updatePassword = async (email: string, password: string) => {
  return userModel.updateOne({ email }, { password }).lean();
};

export const findById = async (id: Types.ObjectId) => {
  return userModel.findById(id).lean();
};

export const update = async (email: string, updatedField: { nickname?: string; username?: string }) => {
  return userModel.updateOne({ email }, updatedField, { upsert: true });
};

export const findByUsername = async (username: string) => {
  return userModel.findOne({ username }).lean();
};

export const addRefreshToken = async (id: string, refreshToken: string) => {
  return userModel.updateOne({ _id: new Types.ObjectId(id) }, { $push: { refreshTokens: refreshToken } });
};

export const resetRefreshTokens = async (id: string) => {
  return userModel.updateOne({ _id: new Types.ObjectId(id) }, { refreshTokens: [] });
};
export const removeRefreshToken = async (id: string, refreshToken: string) => {
  return userModel.updateOne({ _id: new Types.ObjectId(id) }, { $pull: { refreshTokens: refreshToken } });
};
