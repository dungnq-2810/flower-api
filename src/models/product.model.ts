import { Schema, model } from "mongoose";
import {
  IProduct,
  ProductDocument,
} from "../interfaces/models/product.interface";

const productSchema = new Schema<IProduct>(
  {
    id: {
      type: String,
      unique: true,
      required: true,
      min: 1,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      default: null,
      min: 0,
    },
    discount: {
      type: Number,
      default: null,
      min: 0,
      max: 100,
    },
    categoryId: {
      type: String,
      required: true,
    },
    supplierId: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
    isNew: {
      type: Boolean,
      default: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    packageSize: {
      type: String,
      required: true,
    },
    seedCount: {
      type: Number,
      required: true,
      min: 0,
    },
    howToPlant: {
      type: String,
      required: true,
    },
    createdAt: {
      type: String,
      default: () => new Date().toISOString(),
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
productSchema.index({ id: 1 }, { unique: true });
productSchema.index({ slug: 1 }, { unique: true });
productSchema.index({
  name: "text",
  description: "text",
  shortDescription: "text",
});
productSchema.index({ categoryId: 1 });
productSchema.index({ supplierId: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ isBestSeller: 1 });
productSchema.index({ isNew: 1 });

// Auto-increment ID plugin
productSchema.pre("save", async function (next) {
  const doc = this as any;
  if (!doc.id) {
    // @ts-ignore
    const lastProduct = await Product.findOne().sort({ id: -1 }).limit(1);
    doc.id = lastProduct ? lastProduct.id + 1 : 1;
  }
  next();
});

// @ts-ignore
const Product = model<ProductDocument>("Product", productSchema);

export default Product;
