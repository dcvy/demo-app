import { IPost, ICreatePostDTO, IUpdatePostDTO } from "./post.interface";
import { Post } from "./post.collection";
export class PostService {
  static async getAllPosts(): Promise<IPost[]> {
    return await Post.find()
      .populate("author", "name email")
      .populate("category", "name")
      .populate({
        path: "activities",
        populate: { path: "author", select: "name" },
      })
      .lean();
  }

  static async getPostById(id: string): Promise<IPost | null> {
    return await Post.findById(id).lean();
  }

  static async getPostsByUserId(userId: string): Promise<IPost[]> {
    return await Post.find({ author: userId }).lean();
  }

  static async createPost(data: ICreatePostDTO): Promise<IPost> {
    const newPost = await Post.create(data);
    return newPost.toObject();
  }

  static async updatePost(
    id: string,
    data: IUpdatePostDTO
  ): Promise<IPost | null> {
    return await Post.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  static async deletePost(id: string): Promise<IPost | null> {
    return await Post.findByIdAndDelete(id).lean();
  }
}
