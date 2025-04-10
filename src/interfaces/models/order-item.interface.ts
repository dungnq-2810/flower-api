import { Document } from "mongoose";

export interface IOrderItem {
  orderId: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface OrderItemDocument extends IOrderItem, Document {}
