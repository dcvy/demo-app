import { validationResult } from "express-validator";
import { OrderStatus } from "../../utils/enums/order.enum";
import { ZaloPayHelper } from "../../utils/helpers/zalopay.helper";
import { httpResponse } from "../../utils/httpResponse.core";
import { Order } from "./order.collection";
import { OrderSpace } from "./order.interface";
import { OrderService } from "./order.service";

export const createOrderAction: OrderSpace.CreateController = async (
  req,
  res,
  next
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return httpResponse.badRequest(
        res,
        "Dữ liệu đặt hàng không hợp lệ",
        errors.array()
      );
    }

    const userId = (req as any).user._id;
    const newOrder = await OrderService.createOrder(userId, req.body);

    httpResponse.created(res, newOrder, "Đặt hàng thành công");
  } catch (error: any) {
    if (error.message.includes("không tồn tại")) {
      return httpResponse.badRequest(res, error.message);
    }
    next(error);
  }
};

export const createZaloPaymentAction: OrderSpace.CreateZaloPaymentController =
  async (req, res, next) => {
    try {
      const { id: orderId } = req.params;
      const userId = (req as any).user._id;

      const order = await OrderService.getOrderById(orderId);
      if (!order || (order.user as any)._id?.toString() !== userId.toString()) {
        return httpResponse.forbidden(
          res,
          "Chỉ người mua hàng mới có quyền thanh toán"
        );
      }

      const paymentUrl = await OrderService.createPaymentLink(orderId);
      httpResponse.success(
        res,
        { paymentUrl },
        "Tạo link thanh toán thành công"
      );
    } catch (error: any) {
      next(error);
    }
  };

export const zalopayCallbackAction: OrderSpace.ZaloPayCallbackController =
  async (req, res) => {
    try {
      const { data, mac } = req.body;
      if (!ZaloPayHelper.verifyCallback(data, mac)) {
        return res.json({ return_code: 0, return_message: "mac not match" });
      }

      const result = JSON.parse(data);
      if (result.return_code === 1) {
        await Order.findOneAndUpdate(
          { zaloAppTransId: result.app_trans_id },
          { status: OrderStatus.PAID, zaloZpTransId: result.zp_trans_id }
        );
      }

      res.json({ return_code: 1, return_message: "success" });
    } catch (error) {
      res.json({ return_code: 0, return_message: "error" });
    }
  };

export const refundOrderAction: OrderSpace.RefundOrderController = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    const updatedOrder = await OrderService.refundOrder(id);
    httpResponse.success(res, updatedOrder, "Hoàn tiền thành công");
  } catch (error: any) {
    next(error);
  }
};

export const getMyOrdersAction: OrderSpace.GetMyOrdersController = async (
  req,
  res,
  next
) => {
  try {
    const userId = (req as any).user._id;
    const data = await OrderService.getMyOrders(userId);
    httpResponse.success(res, data);
  } catch (error) {
    next(error);
  }
};

export const getAllOrdersAction: OrderSpace.GetAllController = async (
  req,
  res,
  next
) => {
  try {
    const data = await OrderService.getAllOrders();
    httpResponse.success(res, data);
  } catch (error) {
    next(error);
  }
};

export const getOrderByIdAction: OrderSpace.GetByIdController = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const data = await OrderService.getOrderById(id);

    if (!data) return httpResponse.notFound(res, "Không tìm thấy đơn hàng");

    httpResponse.success(res, data);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatusAction: OrderSpace.UpdateStatusController =
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const updatedOrder = await OrderService.updateStatus(id, status);

      if (!updatedOrder)
        return httpResponse.notFound(res, "Không tìm thấy đơn hàng");

      httpResponse.success(
        res,
        updatedOrder,
        `Đã cập nhật trạng thái thành: ${status}`
      );
    } catch (error) {
      next(error);
    }
  };

export const deleteOrderAction: OrderSpace.DeleteOrderController = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user._id;

    const deleted = await OrderService.deleteOrder(id, userId);

    if (!deleted) return httpResponse.notFound(res, "Không tìm thấy đơn hàng");

    httpResponse.success(res, null, "Hủy đơn hàng thành công");
  } catch (error: any) {
    if (
      error.message.includes("không có quyền") ||
      error.message.includes("trạng thái")
    ) {
      return httpResponse.badRequest(res, error.message);
    }
    next(error);
  }
};

export const updateOrderAction: OrderSpace.UpdateOrderController = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user._id;

    const updatedOrder = await OrderService.updateOrder(id, userId, req.body);

    if (!updatedOrder)
      return httpResponse.notFound(res, "Không tìm thấy đơn hàng");

    httpResponse.success(res, updatedOrder, "Cập nhật đơn hàng thành công");
  } catch (error: any) {
    if (
      error.message.includes("không có quyền") ||
      error.message.includes("trạng thái")
    ) {
      return httpResponse.badRequest(res, error.message);
    }
    next(error);
  }
};
