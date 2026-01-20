import { Application } from "express";
import {
  checkPermission,
  verifyToken,
} from "../../utils/middlewares/auth.middleware";
import {
  createOrderAction,
  createZaloPaymentAction,
  deleteOrderAction,
  getAllOrdersAction,
  getMyOrdersAction,
  getOrderByIdAction,
  refundOrderAction,
  updateOrderAction,
  updateOrderStatusAction,
  zalopayCallbackAction,
} from "./order.controller";

export default (app: Application) => {
  app.post("/orders", verifyToken, checkPermission, createOrderAction);

  app.get("/orders/my-orders", verifyToken, checkPermission, getMyOrdersAction);
  app.get("/orders/:id", verifyToken, checkPermission, getOrderByIdAction);

  app.put("/orders/:id", verifyToken, checkPermission, updateOrderAction);

  app.delete("/orders/:id", verifyToken, checkPermission, deleteOrderAction);

  app.get("/orders", verifyToken, checkPermission, getAllOrdersAction);

  app.patch(
    "/orders/status/:id",
    verifyToken,
    checkPermission,
    updateOrderStatusAction
  );

  app.post(
    "/orders/payment/zalopay/:id",
    verifyToken,
    checkPermission,
    createZaloPaymentAction
  );
  app.post("/zalopay/callback", zalopayCallbackAction);

  app.post(
    "/orders/refund/:id",
    verifyToken,
    checkPermission,
    refundOrderAction
  );
};
