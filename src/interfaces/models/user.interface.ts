import { Document } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  avatar: string;
  role: "admin" | "customer";
  createdAt: string;
}

export interface UserDocument extends IUser, Document {}

