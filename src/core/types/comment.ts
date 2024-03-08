import { Types } from 'mongoose';

export default interface IComment {
  user: Types.ObjectId | string;
  content: string;
  date: Date;
}
