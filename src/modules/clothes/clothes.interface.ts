import { Types } from "mongoose";
import { ClothesStatus } from "../../utils/enums/clothes.enum";
import { RouterHandle } from "../../utils/routerHandle.type";

export interface IClothes {
  _id?: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  size: string;
  color: string;
  status: ClothesStatus;
  category: Types.ObjectId | string;
  averageRating?: number;
  rank?: string;
  activities?: any[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateClothesDTO
  extends Omit<
    IClothes,
    "_id" | "activities" | "createdAt" | "updatedAt" | "averageRating" | "rank"
  > {}

export interface IUpdateClothesDTO extends Partial<ICreateClothesDTO> {}

export namespace ClothesSpace {
  export type GetAllController = RouterHandle<{}>;
  export type GetByIdController = RouterHandle<{ params: { id: string } }>;
  export type CreateController = RouterHandle<{ body: ICreateClothesDTO }>;
  export type UpdateController = RouterHandle<{
    params: { id: string };
    body: IUpdateClothesDTO;
  }>;
  export type DeleteController = RouterHandle<{ params: { id: string } }>;
}
