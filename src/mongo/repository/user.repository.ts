import IUser from '../../core/types/user';
import userModel from '../models/user.model';

export const getByUserName = async (email: string) => {
  return await userModel.findOne({ email }).orFail(new Error('User not found')).lean();
};

export const create = async (user: IUser) => {
  return await userModel.create(user);
};

export const updatePassword = async (email: string, password: string) => {
  return await userModel.updateOne({ email }, { password });
};
