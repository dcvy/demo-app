import { Types } from "mongoose";

export interface IUserGroup {
  _id?: Types.ObjectId;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateUserGroupDTO {
  name: string;
  description?: string;
}

export interface IUpdateUserGroupDTO {
  name?: string;
  description?: string;
}
