export const orderSchemas = {
  OrderItem: {
    type: "object",
    properties: {
      clothes: { type: "string", description: "ID của sản phẩm (ObjectId)" },
      quantity: { type: "number", example: 1 },
      priceAtPurchase: {
        type: "number",
        description: "Giá tại thời điểm mua",
        example: 250000,
      },
    },
  },
  Order: {
    type: "object",
    properties: {
      _id: { type: "string" },
      user: { type: "string", description: "ID người dùng đặt hàng" },
      customerName: { type: "string" },
      shippingAddress: { type: "string" },
      items: {
        type: "array",
        items: { $ref: "#/components/schemas/OrderItem" },
      },
      totalPrice: { type: "number" },
      status: {
        type: "string",
        enum: ["pending", "shipping", "completed", "cancelled"],
      },
      orderDate: { type: "string", format: "date-time" },
      zaloAppTransId: { type: "string" },
      zaloZpTransId: { type: "string" },
    },
  },
  CreateOrderDTO: {
    type: "object",
    required: ["shippingAddress", "items"],
    properties: {
      customerName: { type: "string", example: "Nguyễn Văn A" },
      shippingAddress: { type: "string", example: "99 Tô Hiến Thành, Đà Nẵng" },
      items: {
        type: "array",
        items: {
          type: "object",
          required: ["clothesId", "quantity"],
          properties: {
            clothesId: { type: "string", example: "65a7f..." },
            quantity: { type: "number", example: 1 },
          },
        },
      },
    },
  },
};

export const orderSwagger = {
  "/orders": {
    post: {
      summary: "Tạo đơn hàng mới",
      tags: ["Orders"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateOrderDTO" },
          },
        },
      },
      responses: {
        201: {
          description: "Tạo thành công",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Order" },
            },
          },
        },
      },
    },
    get: {
      summary: "Lấy tất cả đơn hàng (Admin/Shop Owner)",
      tags: ["Orders"],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "OK",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: { $ref: "#/components/schemas/Order" },
              },
            },
          },
        },
      },
    },
  },
  "/orders/my-orders": {
    get: {
      summary: "Lấy đơn hàng cá nhân",
      tags: ["Orders"],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "OK",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: { $ref: "#/components/schemas/Order" },
              },
            },
          },
        },
      },
    },
  },
  "/orders/{id}": {
    get: {
      summary: "Chi tiết đơn hàng",
      tags: ["Orders"],
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: "path", name: "id", required: true, schema: { type: "string" } },
      ],
      responses: {
        200: {
          description: "OK",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Order" },
            },
          },
        },
      },
    },
    put: {
      summary: "Cập nhật thông tin đơn hàng",
      tags: ["Orders"],
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: "path", name: "id", required: true, schema: { type: "string" } },
      ],
      requestBody: {
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateOrderDTO" },
          },
        },
      },
      responses: {
        200: { description: "Cập nhật thành công" },
      },
    },
    delete: {
      summary: "Xóa đơn hàng",
      tags: ["Orders"],
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: "path", name: "id", required: true, schema: { type: "string" } },
      ],
      responses: {
        200: { description: "Xóa thành công" },
      },
    },
  },
  "/orders/status/{id}": {
    patch: {
      summary: "Cập nhật trạng thái (Pending/Shipping...)",
      tags: ["Orders"],
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: "path", name: "id", required: true, schema: { type: "string" } },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                status: {
                  type: "string",
                  enum: ["pending", "shipping", "completed", "cancelled"],
                },
              },
            },
          },
        },
      },
      responses: { 200: { description: "OK" } },
    },
  },
  "/orders/payment/zalopay/{id}": {
    post: {
      summary: "Tạo link thanh toán ZaloPay",
      tags: ["Orders"],
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: "path", name: "id", required: true, schema: { type: "string" } },
      ],
      responses: {
        200: { description: "Trả về order_url và app_trans_id" },
      },
    },
  },
  "/zalopay/callback": {
    post: {
      summary: "Webhook từ ZaloPay (ZaloPay call)",
      tags: ["Orders"],
      responses: { 200: { description: "Xác nhận thành công" } },
    },
  },
  "/orders/refund/{id}": {
    post: {
      summary: "Hoàn tiền đơn hàng qua ZaloPay",
      tags: ["Orders"],
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: "path", name: "id", required: true, schema: { type: "string" } },
      ],
      responses: { 200: { description: "Yêu cầu hoàn tiền đã gửi" } },
    },
  },
};
