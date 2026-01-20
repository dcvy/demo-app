import { Schema, model } from "mongoose";
import { OrderStatus } from "../../utils/enums/order.enum";
import { IOrder, IOrderItem } from "./order.interface";

const orderItemSchema = new Schema<IOrderItem>(
  {
    clothes: { type: Schema.Types.ObjectId, ref: "Clothes", required: true },
    quantity: { type: Number, required: true, min: 1 },
    priceAtPurchase: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    customerName: { type: String, required: true },
    shippingAddress: { type: String, required: true },
    items: [orderItemSchema],
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PROCESSING,
    },
    zaloAppTransId: { type: String },
    zaloZpTransId: { type: String },
  },
  {
    timestamps: { createdAt: "orderDate", updatedAt: true },
    versionKey: false,
  }
);

export const Order = model<IOrder>("Order", orderSchema);
