import { Types } from "mongoose";

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
  // Cho phép nhận mảng chuỗi ID từ Request Body
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
