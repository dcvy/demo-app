import { Types } from "mongoose";
import { OrderStatus } from "../../utils/enums/order.enum";
import { RouterHandle } from "../../utils/routerHandle.type";

export interface IOrderItem {
  clothes: Types.ObjectId | string;
  quantity: number;
  priceAtPurchase: number;
}

export interface IOrder {
  _id?: Types.ObjectId;
  user: Types.ObjectId | string;
  customerName: string;
  shippingAddress: string;
  items: IOrderItem[];
  totalPrice: number;
  status: OrderStatus;
  orderDate?: Date;
  zaloAppTransId?: string;
  zaloZpTransId?: string;
}

export interface ICreateOrderDTO {
  customerName?: string;
  shippingAddress: string;
  items: {
    clothesId: string;
    quantity: number;
  }[];
}

export interface IUpdateOrderDTO extends Partial<ICreateOrderDTO> {}

export namespace OrderSpace {
  export type CreateController = RouterHandle<{ body: ICreateOrderDTO }>;
  export type GetMyOrdersController = RouterHandle<{}>;
  export type GetAllController = RouterHandle<{}>;
  export type GetByIdController = RouterHandle<{ params: { id: string } }>;
  export type UpdateStatusController = RouterHandle<{
    params: { id: string };
    body: { status: OrderStatus };
  }>;
  export type UpdateOrderController = RouterHandle<{
    params: { id: string };
    body: IUpdateOrderDTO;
  }>;

  export type DeleteOrderController = RouterHandle<{
    params: { id: string };
  }>;
  export type CreateZaloPaymentController = RouterHandle<{
    params: { id: string };
  }>;

  export type ZaloPayCallbackController = RouterHandle<{
    body: { data: string; mac: string };
  }>;

  export type RefundOrderController = RouterHandle<{
    params: { id: string };
  }>;
}
