import { Category } from "./category.collection";
import {
  ICategory,
  ICreateCategoryDTO,
  IUpdateCategoryDTO,
} from "./category.interface";

export class CategoryService {
  static async getAll(): Promise<ICategory[]> {
    return await Category.find().sort({ createdAt: -1 }).lean();
  }

  static async getById(id: string): Promise<ICategory | null> {
    return await Category.findById(id).lean();
  }

  static async create(data: ICreateCategoryDTO): Promise<ICategory> {
    const newCategory = await Category.create(data);
    return newCategory.toObject();
  }

  static async update(
    id: string,
    data: IUpdateCategoryDTO
  ): Promise<ICategory | null> {
    return await Category.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();
  }

  static async delete(id: string): Promise<ICategory | null> {
    return await Category.findByIdAndDelete(id).lean();
  }
}
