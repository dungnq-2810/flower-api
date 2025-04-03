import { Document } from 'mongoose';

export interface IVariant {
  id?: number;
  productId: number;
  size: string;
  variant: string;
  price: number;
  stockQuantity: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface VariantDocument extends IVariant, Document {
  id: number;
}

// Adding this to match the product types in specification
export interface Variant {
  id: number;
  productId: number;
  size: string;
  variant: string;
  price: number;
  stockQuantity: number;
  createdAt: string;
  updatedAt: string;
}