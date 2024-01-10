import { Types } from 'mongoose';
import IComment from './comment';
import IUser from './user';

export interface IPost {
  _id: Types.ObjectId;
  owner: Types.ObjectId;
  title: string;
  content: string;
  imagePath: string;
  comments: Types.ObjectId[];
}

export interface IPostPopulated {
  _id: string;
  owner: IUser;
  title: string;
  content: string;
  imagePath: string;
  comments: IComment[];
}
