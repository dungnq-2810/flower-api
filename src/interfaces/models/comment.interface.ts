import { Document } from "mongoose";

export interface IComment {
  id?: number;
  productId: number;
  userId: String;
  userName: string;
  userAvatar: string;
  rating: number;
  content: string;
  createdAt: string;
}

export interface CommentDocument extends IComment, Document {
  id: number;
}
