import { Types } from "mongoose";
import { Clothes } from "../clothes/clothes.collection";
import { Activity } from "./activity.collection";
import { ICreateActivityDTO } from "./activity.interface";

export class ActivityService {
  static async create(data: ICreateActivityDTO) {
    // 1. Tạo Activity mới
    const newActivity = await Activity.create(data);
    await newActivity.populate("author", "username fullName");

    // 2. Tính toán điểm trung bình bằng Aggregate
    const stats = await Activity.aggregate([
      { $match: { clothes: new Types.ObjectId(data.clothes as string) } },
      { $group: { _id: "$clothes", avgRating: { $avg: "$rating" } } },
    ]);

    const avg = stats[0]?.avgRating || 0;

    // 3. Phân loại thứ hạng dựa trên điểm
    let rank = "Kém";
    if (avg >= 4.5) rank = "Xuất Sắc";
    else if (avg >= 4.0) rank = "Tốt";
    else if (avg >= 3.0) rank = "Trung bình";

    // 4. Cập nhật lại vào bảng Clothes
    await Clothes.findByIdAndUpdate(data.clothes, {
      averageRating: parseFloat(avg.toFixed(1)),
      rank: rank,
    });

    return {
      newActivity,
      averageRating: parseFloat(avg.toFixed(1)),
      rank,
    };
  }

  static async getByClothesId(clothesId: string) {
    return await Activity.find({ clothes: clothesId })
      .populate("author", "username fullName")
      .sort({ createdAt: -1 })
      .lean();
  }

  static async findClothesIdByName(
    name: string | Types.ObjectId
  ): Promise<string> {
    if (name instanceof Types.ObjectId) {
      return name.toString();
    }

    const clothes = await Clothes.findOne({ name });
    if (!clothes) throw new Error("Không tìm thấy sản phẩm");

    return clothes._id.toString();
  }
}
