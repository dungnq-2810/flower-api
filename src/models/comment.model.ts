import { Schema, model } from "mongoose";
import {
  IComment,
  CommentDocument,
} from "../interfaces/models/comment.interface";

const commentSchema = new Schema<IComment>(
  {
    id: {
      type: Number,
      unique: true,
      required: true,
      min: 1,
    },
    productId: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userAvatar: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    content: {
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
commentSchema.index({ id: 1 }, { unique: true });
commentSchema.index({ productId: 1 });
commentSchema.index({ userId: 1 });
commentSchema.index({ rating: -1 });
commentSchema.index({ createdAt: -1 });

// Auto-increment ID plugin
commentSchema.pre("save", async function (next) {
  const doc = this as any;
  if (!doc.id) {
    // @ts-ignore
    const lastComment = await Comment.findOne().sort({ id: -1 }).limit(1);
    doc.id = lastComment ? lastComment.id + 1 : 1;
  }
  next();
});

// @ts-ignore
const Comment = model<CommentDocument>("Comment", commentSchema);

export default Comment;
