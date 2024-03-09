import { Types } from 'mongoose';
import IUser from './user';

export default interface IComment {
  user: Types.ObjectId | Partial<IUser>;
  content: string;
  date: Date;
}
