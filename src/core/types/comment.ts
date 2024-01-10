import { Types } from 'mongoose';

export default interface IComment {
  _id: Types.ObjectId;
  owner: Types.ObjectId;
  post: Types.ObjectId;
  content: string;
}
