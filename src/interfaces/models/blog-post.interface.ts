import { Document } from 'mongoose';

export interface IBlogPost {
  id?: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  authorId: number;
  authorName: string;
  createdAt: string;
  tags: string[];
}

export interface BlogPostDocument extends IBlogPost, Document {
  id: number;
}
