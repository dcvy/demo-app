import { Types } from "mongoose";
import { CategoryStatus } from "../../utils/enums/category.enum";
import { RouterHandle } from "../../utils/routerHandle.type";
export interface ICategory {
  _id?: Types.ObjectId;
  name: string;
  description?: string;
  status: CategoryStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateCategoryDTO
  extends Omit<ICategory, "_id" | "createdAt" | "updatedAt"> {}

export interface IUpdateCategoryDTO extends Partial<ICreateCategoryDTO> {}

export namespace CategorySpace {
  export type GetAllController = RouterHandle<{}>;
  export type GetByIdController = RouterHandle<{ params: { id: string } }>;
  export type CreateController = RouterHandle<{ body: ICreateCategoryDTO }>;
  export type UpdateController = RouterHandle<{
    params: { id: string };
    body: IUpdateCategoryDTO;
  }>;
  export type DeleteController = RouterHandle<{ params: { id: string } }>;
}
