import { Document } from 'mongoose';

export interface IUser {
  id?: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  avatar: string;
  role: 'admin' | 'customer';
  createdAt: string;
}

export interface UserDocument extends IUser, Document {
  id: number;
}
