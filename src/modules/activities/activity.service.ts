import { IActivity } from "./activity.interface";
import { Activity } from "./activity.collection";
import { Post } from "../posts/post.collection";
import { Types } from "mongoose";

export class ActivityService {
  static async create(data: IActivity) {
    const newActivity = await (
      await Activity.create(data)
    ).populate("author", "name");

    const stats = await Activity.aggregate([
      { $match: { post: new Types.ObjectId(data.post as string) } },
      { $group: { _id: "$post", avgRating: { $avg: "$rating" } } },
    ]);

    const avg = stats[0]?.avgRating || 0;

    let rank = "Kém";
    if (avg >= 4.5) rank = "Xuất Sắc";
    else if (avg >= 4.0) rank = "Tốt";
    else if (avg >= 3.0) rank = "Trung bình";

    await Post.findByIdAndUpdate(data.post, {
      averageRating: parseFloat(avg.toFixed(1)),
      rank: rank,
    });

    return { newActivity, averageRating: avg, rank };
  }

  static async getByPostId(postId: string) {
    return await Activity.find({ post: postId })
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .lean();
  }
}
