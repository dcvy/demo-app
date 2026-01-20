import { OrderStatus } from "../../utils/enums/order.enum";
import { ZaloPayHelper } from "../../utils/helpers/zalopay.helper";
import { Clothes } from "../clothes/clothes.collection";
import { User } from "../users/user.collection";
import { Order } from "./order.collection";
import { ICreateOrderDTO, IUpdateOrderDTO } from "./order.interface";

export class OrderService {
  static async createOrder(userId: string, data: ICreateOrderDTO) {
    const { items, shippingAddress, customerName } = data;
    const clothesIds = items.map((item) => item.clothesId);

    const clothesDocs = await Clothes.find({ _id: { $in: clothesIds } });

    if (clothesDocs.length !== clothesIds.length) {
      throw new Error("Một số sản phẩm không tồn tại hoặc đã bị xóa");
    }

    const clothesMap = new Map(
      clothesDocs.map((doc) => [doc._id.toString(), doc])
    );

    let totalPrice = 0;
    const orderItems: any[] = [];

    for (const item of items) {
      const product = clothesMap.get(item.clothesId);
      if (!product) continue;

      const priceAtPurchase = product.price;
      const itemTotal = priceAtPurchase * item.quantity;

      totalPrice += itemTotal;

      orderItems.push({
        clothes: product._id,
        quantity: item.quantity,
        priceAtPurchase: priceAtPurchase,
      });
    }

    let finalCustomerName = customerName;
    if (!finalCustomerName) {
      const userDoc = await User.findById(userId);
      finalCustomerName =
        userDoc?.fullName || userDoc?.username || "Khách hàng";
    }

    const newOrder = await Order.create({
      user: userId,
      customerName: finalCustomerName,
      shippingAddress,
      items: orderItems,
      totalPrice,
      status: OrderStatus.PENDING_PAYMENT,
    });

    return newOrder.toObject();
  }

  static async createPaymentLink(orderId: string) {
    const order = await Order.findById(orderId).lean();
    if (!order || order.status !== OrderStatus.PENDING_PAYMENT) {
      throw new Error("Đơn hàng không hợp lệ để thanh toán");
    }

    const today = new Date();
    const yy = today.getFullYear().toString().slice(-2);
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const app_trans_id = `${yy}${mm}${dd}_${order._id}`;

    const items = order.items.map((item: any) => ({
      itemid: item.clothes.toString(),
      itemname: "Sản phẩm quần áo",
      itemquantity: item.quantity,
      itemprice: item.priceAtPurchase,
    }));

    const description = `Thanh toán đơn hàng #${order._id}`;

    const zpResponse = await ZaloPayHelper.createOrder({
      amount: order.totalPrice,
      description,
      app_trans_id,
      items,
    });
    console.log(
      "🚀 ~ OrderService ~ createPaymentLink ~ zpResponse:",
      zpResponse
    );

    if (zpResponse.return_code !== 1) {
      throw new Error(
        zpResponse.sub_return_message || "Tạo thanh toán thất bại"
      );
    }

    await Order.findByIdAndUpdate(orderId, { zaloAppTransId: app_trans_id });

    return zpResponse.order_url;
  }

  static async refundOrder(orderId: string) {
    const order = await Order.findById(orderId);
    if (!order || order.status !== OrderStatus.PAID || !order.zaloZpTransId) {
      throw new Error("Không thể hoàn tiền cho đơn hàng này");
    }

    const today = new Date();
    const yy = today.getFullYear().toString().slice(-2);
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const m_refund_id = `${yy}${mm}${dd}_${order.zaloAppTransId}_refund`;

    const description = `Hoàn tiền đơn hàng #${order._id}`;

    const zpResponse = await ZaloPayHelper.refund({
      m_refund_id,
      zp_trans_id: order.zaloZpTransId,
      amount: order.totalPrice,
      description,
    });

    if (zpResponse.return_code !== 1) {
      throw new Error(zpResponse.sub_return_message || "Hoàn tiền thất bại");
    }

    order.status = OrderStatus.REFUNDED;
    await order.save();
    return order;
  }

  static async getMyOrders(userId: string) {
    return await Order.find({ user: userId })
      .populate("items.clothes", "name size color")
      .sort({ orderDate: -1 })
      .lean();
  }

  static async getAllOrders() {
    return await Order.find()
      .populate("user", "username email")
      .populate("items.clothes", "name")
      .sort({ orderDate: -1 })
      .lean();
  }

  static async getOrderById(orderId: string) {
    return await Order.findById(orderId)
      .populate("user", "username email")
      .populate("items.clothes", "name description size color image")
      .lean();
  }

  static async updateStatus(orderId: string, status: OrderStatus) {
    return await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).lean();
  }

  static async deleteOrder(orderId: string, userId: string) {
    const order = await Order.findById(orderId);

    if (!order) return null;

    if (order.status !== OrderStatus.PENDING_PAYMENT) {
      throw new Error(
        "Chỉ có thể xóa đơn hàng khi đang ở trạng thái Chờ xử lý (Pending)"
      );
    }

    return await Order.findByIdAndDelete(orderId).lean();
  }

  static async updateOrder(
    orderId: string,
    userId: string,
    data: IUpdateOrderDTO
  ) {
    const order = await Order.findById(orderId);

    if (!order) return null;

    if (order.status !== OrderStatus.PENDING_PAYMENT) {
      throw new Error(
        "Chỉ có thể cập nhật đơn hàng khi đang ở trạng thái Chờ xử lý (Pending)"
      );
    }

    const updatePayload: any = { ...data };

    if (data.items && data.items.length > 0) {
      const clothesIds = data.items.map((item) => item.clothesId);
      const clothesDocs = await Clothes.find({ _id: { $in: clothesIds } });

      if (clothesDocs.length !== clothesIds.length) {
        throw new Error("Sản phẩm mới cập nhật không tồn tại");
      }

      const clothesMap = new Map(
        clothesDocs.map((doc) => [doc._id.toString(), doc])
      );

      let newTotalPrice = 0;
      const newOrderItems: any[] = [];

      for (const item of data.items) {
        const product = clothesMap.get(item.clothesId);
        if (!product) continue;

        const price = product.price;
        newTotalPrice += price * item.quantity;

        newOrderItems.push({
          clothes: product._id,
          quantity: item.quantity,
          priceAtPurchase: price,
        });
      }

      updatePayload.items = newOrderItems;
      updatePayload.totalPrice = newTotalPrice;
    }

    return await Order.findByIdAndUpdate(orderId, updatePayload, {
      new: true,
    }).lean();
  }
}
