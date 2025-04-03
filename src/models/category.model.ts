import { Schema, model } from "mongoose";
import {
  ICategory,
  CategoryDocument,
} from "../interfaces/models/category.interface";

const categorySchema = new Schema<ICategory>(
  {
    id: {
      type: Number,
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
    image: {
      type: String,
      required: true,
    },
    productCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes
categorySchema.index({ id: 1 }, { unique: true });
categorySchema.index({ slug: 1 }, { unique: true });
categorySchema.index({ name: "text", description: "text" });

// Auto-increment ID plugin
categorySchema.pre("save", async function (next) {
  const doc = this as any;
  if (!doc.id) {
    // @ts-ignore
    const lastCategory = await Category.findOne().sort({ id: -1 }).limit(1);
    doc.id = lastCategory ? lastCategory.id + 1 : 1;
  }
  next();
});

// @ts-ignore
const Category = model<CategoryDocument>("Category", categorySchema);

export default Category;
