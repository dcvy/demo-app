import { Clothes } from "./clothes.collection";
import {
  IClothes,
  ICreateClothesDTO,
  IUpdateClothesDTO,
} from "./clothes.interface";

export class ClothesService {
  static async getAll(): Promise<IClothes[]> {
    return await Clothes.find()
      .populate("category", "name")
      .populate({
        path: "activities",
        populate: { path: "author", select: "username fullName" },
      })
      .sort({ createdAt: -1 })
      .lean();
  }

  static async getById(id: string): Promise<IClothes | null> {
    return await Clothes.findById(id)
      .populate("category", "name")
      .populate({
        path: "activities",
        populate: { path: "author", select: "username fullName" },
      })
      .lean();
  }

  static async create(data: ICreateClothesDTO): Promise<IClothes> {
    const newClothes = await Clothes.create(data);
    return newClothes.toObject();
  }

  static async update(
    id: string,
    data: IUpdateClothesDTO
  ): Promise<IClothes | null> {
    return await Clothes.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();
  }

  static async delete(id: string): Promise<IClothes | null> {
    return await Clothes.findByIdAndDelete(id).lean();
  }
}
