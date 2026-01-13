import { Schema, model } from "mongoose";
import { IUserGroup } from "./userGroup.interface";

const UserGroupSchema = new Schema<IUserGroup>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: { type: String },
  },
  { timestamps: true }
);

export const UserGroup = model<IUserGroup>("UserGroup", UserGroupSchema);
