import { httpResponse } from "../../utils/httpResponse.core";
import { ActivitySpace } from "./activity.interface";
import { ActivityService } from "./activity.service";

// 1. Create Activity (Comment & Rate)
export const createActivityAction: ActivitySpace.CreateController = async (
  req,
  res,
  next
) => {
  try {
    const { clothes: clothesName, content, rating } = req.body;

    let clothesId: string;
    try {
      clothesId = await ActivityService.findClothesIdByName(clothesName);
    } catch (error: any) {
      return httpResponse.badRequest(res, error.message);
    }

    const userId = (req as any).user._id;

    const result = await ActivityService.create({
      clothes: clothesId,
      author: userId,
      content,
      rating,
    });

    const io = req.app.get("io");
    if (io) {
      io.to(clothesId.toString()).emit("NEW_COMMENT_EVENT", {
        clothesName: clothesName,
        content: result.newActivity.content,
        author: (req as any).user.fullName || (req as any).user.username,
        avgRating: result.averageRating,
      });
    }

    httpResponse.created(res, result, "Đã gửi đánh giá thành công");
  } catch (error) {
    next(error);
  }
};

export const getActivitiesByClothesAction: ActivitySpace.GetByClothesIdController =
  async (req, res, next) => {
    try {
      const { clothesId } = req.params;
      const data = await ActivityService.getByClothesId(clothesId);

      httpResponse.success(res, data);
    } catch (error) {
      next(error);
    }
  };
