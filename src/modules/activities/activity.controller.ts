import { Response, NextFunction } from "express";
import { ActivityService } from "./activity.service";

export class ActivityController {
  static async create(req: any, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const { postId, content, rating } = req.body;

      const result = await ActivityService.create({
        post: postId,
        author: userId,
        content,
        rating,
      });

      const io = req.app.get("io");
      io.to(postId).emit("NEW_COMMENT_EVENT", {
        postId: postId,
        content: result.newActivity.content,
        rating: result.newActivity.rating,
        author: req.user.name,
        avgRating: result.averageRating,
        rank: result.rank,
      });

      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getByPost(req: any, res: Response, next: NextFunction) {
    try {
      const data = await ActivityService.getByPostId(req.params.postId);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}
