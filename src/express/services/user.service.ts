import { Types } from 'mongoose';
import IUser from '../../core/types/user';
import * as userRepository from '../../mongo/repositories/user.repository';
import { BadRequestError } from '../../core/Errors';
import fs from 'fs';

export const getByEmail = async (email: string) => {
  return userRepository.findByEmail(email);
};

export const getByUsername = async (username: string) => {
  return userRepository.findByUsername(username);
};

export const create = async (user: IUser) => {
  return userRepository.create(user);
};

export const addRefreshToken = async (_id: string, refreshToken: string) => {
  return userRepository.addRefreshToken(_id, refreshToken);
};

export const resetRefreshTokens = async (_id: string) => {
  return userRepository.resetRefreshTokens(_id);
};

export const removeRefreshToken = async (_id: string, refreshToken: string) => {
  return userRepository.removeRefreshToken(_id, refreshToken);
};

export const getById = async (id: Types.ObjectId) => {
  return userRepository.findById(id);
};

export const update = async (id: Types.ObjectId, updatedField: Partial<IUser>) => {
  if (updatedField.email && (await getByEmail(updatedField.email))) {
    throw new BadRequestError('Email already exists');
  }

  if (updatedField.username && (await getByUsername(updatedField.username))) {
    throw new BadRequestError('Username already exists');
  }

  const user = await userRepository.findById(id);
  if (user.profileImage) {
    try {
      fs.unlinkSync(`public/images/${user.profileImage}`);
    } catch (e) {
      console.error('Error deleting file', e.message);
    }
  }

  return userRepository.update(id, updatedField);
};
