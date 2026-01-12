import { Schema, model, Types } from "mongoose";

export interface IActivity {
  _id?: string;
  post: Types.ObjectId | string;
  author: Types.ObjectId | string;
  content: string;
  rating: number;
}

export interface ICreateActivityDTO extends IActivity {}