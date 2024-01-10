import mongoose from 'mongoose';
import config from '../../config/env.config';
import IComment from '../../core/types/comment';

const commentSchema = new mongoose.Schema<IComment>(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
    owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: config.mongo.usersCollectionName },
    post: { type: mongoose.Schema.Types.ObjectId, required: true, ref: config.mongo.postsCollectionName },
    content: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model(config.mongo.commentsCollectionName, commentSchema);
