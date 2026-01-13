import { Schema, model } from "mongoose";
import { IUser } from "./user.interface";
import { UserGroup } from "./../userGroups/userGroup.collection";

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, trim: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    gender: { type: String, enum: ["Nam", "Nữ", "Khác"] },
    birthYear: { type: Number },
    address: { type: String },
    userGroup: [
      {
        type: Schema.Types.ObjectId,
        ref: "UserGroup",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User = model<IUser>("User", userSchema);
