import { Schema, model } from "mongoose";
import {
  IOrderItem,
  OrderItemDocument,
} from "../interfaces/models/order-item.interface";

const orderItemSchema = new Schema<IOrderItem>(
  {
    id: {
      type: Number,
      unique: true,
      required: true,
      min: 1,
    },
    orderId: {
      type: Number,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    productImage: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (_, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes
orderItemSchema.index({ id: 1 }, { unique: true });
orderItemSchema.index({ orderId: 1 });
orderItemSchema.index({ productId: 1 });

// Auto-increment ID plugin
orderItemSchema.pre("save", async function (next) {
  const doc = this as any;
  if (!doc.id) {
    // @ts-ignore
    const lastOrderItem = await OrderItem.findOne().sort({ id: -1 }).limit(1);
    doc.id = lastOrderItem ? lastOrderItem.id + 1 : 1;
  }
  next();
});

// @ts-ignore
const OrderItem = model<OrderItemDocument>("OrderItem", orderItemSchema);

export default OrderItem;
