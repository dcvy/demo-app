import { Schema, model } from "mongoose";
import { ClothesStatus } from "../../utils/enums/clothes.enum";
import { IClothes } from "./clothes.interface";

const clothesSchema = new Schema<IClothes>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    size: { type: String, required: true },
    color: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(ClothesStatus),
      default: ClothesStatus.ACTIVE,
    },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    averageRating: { type: Number, default: 0 },
    rank: { type: String, default: "Chưa có" },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

clothesSchema.virtual("activities", {
  ref: "Activity",
  localField: "_id",
  foreignField: "clothes",
});

export const Clothes = model<IClothes>("Clothes", clothesSchema);
