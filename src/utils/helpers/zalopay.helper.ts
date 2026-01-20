import axios from "axios";
import crypto from "crypto";
import qs from "qs"; // npm install qs

export class ZaloPayHelper {
  private static config = {
    app_id: process.env.ZALOPAY_APP_ID!,
    key1: process.env.ZALOPAY_KEY1!,
    key2: process.env.ZALOPAY_KEY2!,
    createEndpoint:
      process.env.NODE_ENV === "production"
        ? "https://sb-openapi.zalopay.vn/v2/create"
        : "https://sb-openapi.zalopay.vn/v2/create",
    refundEndpoint:
      process.env.NODE_ENV === "production"
        ? "https://sb-openapi.zalopay.vn/v2/refund"
        : "https://sb-openapi.zalopay.vn/v2/refund",
  };

  static async createOrder(params: {
    amount: number;
    description: string;
    app_trans_id: string;
    items?: any[];
    embed_data?: any;
  }) {
    const {
      amount,
      description,
      app_trans_id,
      items = [],
      embed_data = {},
    } = params;

    const app_time = Date.now();
    const app_user = "zalopay";

    const embedDataFinal = {
      redirecturl: `${process.env.FRONTEND_URL}/order/success`,
      ...embed_data,
    };
    const embedDataStr = JSON.stringify(embedDataFinal);

    const itemStr = JSON.stringify(items);

    const dataStr = `${this.config.app_id}|${app_trans_id}|${app_user}|${amount}|${app_time}|${embedDataStr}|${itemStr}`;
    const mac = crypto
      .createHmac("sha256", this.config.key1)
      .update(dataStr)
      .digest("hex");

    const payload = {
      app_id: this.config.app_id,
      app_trans_id,
      app_user,
      amount,
      app_time,
      embed_data: embedDataStr,
      item: itemStr,
      description,
      callback_url: process.env.ZALOPAY_CALLBACK_URL,
      mac,
      bank_code: "",
    };

    const response = await axios.post(
      this.config.createEndpoint,
      qs.stringify(payload),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    return response.data;
  }

  static verifyCallback(data: string, receivedMac: string): boolean {
    const computedMac = crypto
      .createHmac("sha256", this.config.key2)
      .update(data)
      .digest("hex");
    return computedMac === receivedMac;
  }

  static async refund(params: {
    m_refund_id: string;
    zp_trans_id: string;
    amount: number;
    description: string;
  }) {
    const { m_refund_id, zp_trans_id, amount, description } = params;
    const timestamp = Date.now();

    const dataStr = `${this.config.app_id}|${m_refund_id}|${zp_trans_id}|${amount}|${description}|${timestamp}`;
    const mac = crypto
      .createHmac("sha256", this.config.key1)
      .update(dataStr)
      .digest("hex");

    const payload = {
      app_id: this.config.app_id,
      m_refund_id,
      timestamp,
      zp_trans_id,
      amount,
      description,
      mac,
    };

    const response = await axios.post(
      this.config.refundEndpoint,
      qs.stringify(payload),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    return response.data;
  }
}
