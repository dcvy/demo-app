import { Types } from "mongoose";

export interface ICategory {
  _id?: Types.ObjectId;
  name: string;
  description?: string;
}

export interface ICreateCategoryDTO extends ICategory {}
export interface IUpdateCategoryDTO extends Partial<ICategory> {}