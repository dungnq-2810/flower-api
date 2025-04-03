import { Document } from "mongoose";

export interface IOrderItem {
  id?: number;
  orderId: number;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface OrderItemDocument extends IOrderItem, Document {
  id: number;
}
