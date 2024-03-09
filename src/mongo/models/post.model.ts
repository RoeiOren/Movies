import mongoose from 'mongoose';
import config from '../../config/env.config';
import { IPost } from '../../core/types/post';

const postSchema = new mongoose.Schema<IPost>(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: config.mongo.usersCollectionName, required: true },
    movieName: { type: String, required: true },
    content: { type: String, required: true },
    imageName: { type: String, required: false },
    comments: {
      type: [
        {
          user: { type: mongoose.Schema.Types.ObjectId, ref: config.mongo.usersCollectionName, required: true },
          content: { type: String, required: true },
          date: { type: Date, required: true },
        },
      ],
      required: true,
      default: [],
    },
    imdbId: { type: String, required: true },
    date: { type: Date, required: true },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model(config.mongo.postsCollectionName, postSchema);
