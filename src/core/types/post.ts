import { Types } from 'mongoose';
import IComment from './comment';
import IUser from './user';

export interface IPost {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  movieName: string;
  content: string;
  imageName?: string;
  comments: IComment[];
  imdbId: string;
  imdbRating?: number;
  date: Date;
}

export interface IPostPopulated {
  _id: string;
  user: IUser;
  movieName: string;
  content: string;
  imageName: string;
  comments: IComment[];
  imdbId: string;
  imdbRating?: number;
  date: Date;
}
