import { Schema, model } from "mongoose";
import { IUser, UserDocument } from "../interfaces/models/user.interface";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer",
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
userSchema.index({ id: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });

// Auto-increment ID plugin
userSchema.pre("save", async function (next) {
  const doc = this as any;
  if (!doc.id) {
    // @ts-ignore
    const lastUser = await User.findOne().sort({ id: -1 }).limit(1);
    doc.id = lastUser ? lastUser.id + 1 : 1;
  }
  next();
});

// @ts-ignore
const User = model<UserDocument>("User", userSchema);

export default User;
