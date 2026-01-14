import { Types } from "mongoose";
import { RouterHandle } from "../../utils/routerHandle.type";

export interface IUser {
  _id?: Types.ObjectId;
  username: string;
  fullName: string;
  email: string;
  password: string;
  gender?: "Nam" | "Nữ" | "Khác";
  birthYear?: number;
  address?: string;
  userGroup?: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateUserDTO
  extends Omit<IUser, "_id" | "createdAt" | "updatedAt" | "userGroup"> {
  username: string;
  fullName: string;
  email: string;
  password: string;
  userGroup?: string[];
}

export interface IUpdateUserDTO
  extends Partial<
    Omit<IUser, "_id" | "createdAt" | "updatedAt" | "password" | "userGroup">
  > {
  password?: string;
  userGroup?: string[];
}

export interface IUserResponse extends Omit<IUser, "password"> {}

export namespace UserSpace {
  export type GetAllController = RouterHandle<{}>;

  export type GetByIdController = RouterHandle<{
    params: { id: string };
  }>;

  export type CreateController = RouterHandle<{
    body: ICreateUserDTO;
  }>;

  export type UpdateController = RouterHandle<{
    params: { id: string };
    body: IUpdateUserDTO;
  }>;

  export type DeleteController = RouterHandle<{
    params: { id: string };
  }>;
}
