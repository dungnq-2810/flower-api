import { Schema, model } from 'mongoose';
import { VariantDocument } from '../interfaces/models/variant.interface';

const VariantSchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    productId: {
      type: Number,
      required: true,
      ref: 'Product',
      index: true,
    },
    size: {
      type: String,
      required: true,
    },
    variant: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stockQuantity: {
      type: Number,
      required: true,
      default: 0,
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Set up Counter sequence for auto-incrementing ID
VariantSchema.pre('save', async function (next) {
  if (this.isNew) {
    const Counter = model('Counter');
    const counter = await Counter.findOneAndUpdate(
      { name: 'variant' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.id = counter.seq;
  }
  next();
});

export default model<VariantDocument>('Variant', VariantSchema);