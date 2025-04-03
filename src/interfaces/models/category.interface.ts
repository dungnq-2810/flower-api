import { Document } from 'mongoose';

export interface ICategory {
  id?: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

export interface CategoryDocument extends ICategory, Document {
  id: number;
}
