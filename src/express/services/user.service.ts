import { Types } from 'mongoose';
import IUser from '../../core/types/user';
import * as userRepository from '../../mongo/repositories/user.repository';
import { ServiceError } from '../../core/Errors';

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

export const update = async (id: string, updatedField: Partial<IUser>) => {
  if (updatedField.email && (await getByEmail(updatedField.email))) {
    throw new ServiceError('Email already exists', 409);
  }

  if (updatedField.username && (await getByUsername(updatedField.username))) {
    throw new ServiceError('Username already exists', 409);
  }

  return userRepository.update(id, updatedField);
};
