import { Schema, model } from "mongoose";
import { CategoryStatus } from "../../utils/enums/category.enum";
import { ICategory } from "./category.interface";

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    status: {
      type: String,
      enum: Object.values(CategoryStatus),
      default: CategoryStatus.ACTIVE,
    },
  },
  { timestamps: true, versionKey: false }
);

export const Category = model<ICategory>("Category", categorySchema);
