import { Schema, model } from 'mongoose';
import { IBlogPost, BlogPostDocument } from '../interfaces/models/blog-post.interface';

const blogPostSchema = new Schema<IBlogPost>(
  {
    id: {
      type: Number,
      unique: true,
      required: true,
      min: 1,
    },
    title: {
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
    excerpt: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    authorId: {
      type: Number,
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    createdAt: {
      type: String,
      default: () => new Date().toISOString(),
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
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
blogPostSchema.index({ id: 1 }, { unique: true });
blogPostSchema.index({ slug: 1 }, { unique: true });
blogPostSchema.index({ title: 'text', content: 'text', excerpt: 'text' });
blogPostSchema.index({ authorId: 1 });
blogPostSchema.index({ tags: 1 });
blogPostSchema.index({ createdAt: -1 });

// Auto-increment ID plugin
blogPostSchema.pre('save', async function(next) {
  const doc = this as any;
  if (!doc.id) {
    // @ts-ignore
    const lastBlogPost = await BlogPost.findOne().sort({ id: -1 }).limit(1);
    doc.id = lastBlogPost ? lastBlogPost.id + 1 : 1;
  }
  next();
});

// @ts-ignore
const BlogPost = model<BlogPostDocument>('BlogPost', blogPostSchema);

export default BlogPost;
