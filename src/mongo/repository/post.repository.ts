import postModel from '../models/post.model';

export const findManyByOwner = async (ownerId: string) => {
  return await postModel.find({ owner: ownerId }).populate('owner').lean();
};

export const updatePostMetaData = async (id: string, updateFields: { title?: string; content?: string }) => {
  return await postModel.updateOne({ _id: id }, updateFields);
};

export const deletePost = async (id: string) => {
  return await postModel.deleteOne({ _id: id });
};
