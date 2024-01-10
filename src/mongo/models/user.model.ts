import mongoose from 'mongoose';
import IUser from '../../core/types/user';
import config from '../../config/env.config';

const usersSchema = new mongoose.Schema<IUser>(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicturePath: { type: String, required: false },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model(config.mongo.usersCollectionName, usersSchema);
