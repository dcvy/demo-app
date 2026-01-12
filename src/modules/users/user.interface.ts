import { Types } from "mongoose";

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  age: number;
}

export interface ICreateUserDTO extends IUser {}
export interface IUpdateUserDTO extends Partial<IUser> {}
