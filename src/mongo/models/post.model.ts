import mongoose from 'mongoose';
import config from '../../config/env.config';
import { IPost } from '../../core/types/post';

const postSchema = new mongoose.Schema<IPost>(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: config.mongo.usersCollectionName, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    imagePath: { type: String, required: true },
    comments: { type: [mongoose.Schema.Types.ObjectId], ref: config.mongo.commentsCollectionName },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model(config.mongo.postsCollectionName, postSchema);
