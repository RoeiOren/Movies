import bcrypt from 'bcrypt';

export default async (input: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(input, salt);
};
