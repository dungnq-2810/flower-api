import { Schema, model } from 'mongoose';
import { IOrder, OrderDocument } from '../interfaces/models/order.interface';

const orderSchema = new Schema<IOrder>(
  {
    id: {
      type: Number,
      unique: true,
      required: true,
      min: 1,
    },
    userId: {
      type: Number,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
      required: true,
    },
    customerPhone: {
      type: String,
      required: true,
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'bank_transfer', 'credit_card'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingFee: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    notes: {
      type: String,
      default: null,
    },
    createdAt: {
      type: String,
      default: () => new Date().toISOString(),
    },
    updatedAt: {
      type: String,
      default: () => new Date().toISOString(),
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    },
    toObject: {
      virtuals: true,
      transform: (_, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Indexes
orderSchema.index({ id: 1 }, { unique: true });
orderSchema.index({ userId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });

// Auto-increment ID plugin
orderSchema.pre('save', async function(next) {
  const doc = this as any;
  if (!doc.id) {
    // @ts-ignore
    const lastOrder = await Order.findOne().sort({ id: -1 }).limit(1);
    doc.id = lastOrder ? lastOrder.id + 1 : 1;
  }
  next();
});

// @ts-ignore
const Order = model<OrderDocument>('Order', orderSchema);

export default Order;
