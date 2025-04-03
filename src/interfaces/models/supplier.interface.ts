import { Document } from 'mongoose';

export interface ISupplier {
  id?: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  contactPerson: string;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface SupplierDocument extends ISupplier, Document {
  id: number;
}