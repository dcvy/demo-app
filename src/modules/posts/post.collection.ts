import { Schema, model } from "mongoose";
import { IPost } from "./post.interface";

const postSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    averageRating: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true }, // Cho phép hiển thị virtual khi trả về JSON
    toObject: { virtuals: true },
  }
);

// Định nghĩa quan hệ ảo:
// "Hãy tìm trong bảng Activity, những dòng nào có trường 'post' khớp với '_id' của tôi"
postSchema.virtual("activities", {
  ref: "Activity",
  localField: "_id",
  foreignField: "post",
});

export const Post = model<IPost>("Post", postSchema);
