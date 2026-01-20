import { Types } from "mongoose";
import { RouterHandle } from "../../utils/routerHandle.type";

export interface IActivity {
  _id?: Types.ObjectId;
  clothes: Types.ObjectId | string;
  author: Types.ObjectId | string;
  content: string;
  rating: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateActivityDTO
  extends Omit<IActivity, "_id" | "createdAt" | "updatedAt"> {}

export namespace ActivitySpace {
  export type GetByClothesIdController = RouterHandle<{
    params: { clothesId: string };
  }>;

  export type CreateController = RouterHandle<{ body: ICreateActivityDTO }>;
  export type DeleteController = RouterHandle<{ params: { id: string } }>;
}
