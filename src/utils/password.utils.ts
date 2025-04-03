import bcrypt from 'bcrypt';
import config from '../config';

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, config.saltRounds);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};
