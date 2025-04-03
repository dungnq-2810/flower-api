import { Document } from 'mongoose';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cod' | 'bank_transfer' | 'credit_card';
export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface IOrder {
  id?: number;
  userId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderDocument extends IOrder, Document {
  id: number;
}
