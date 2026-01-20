export const clothesSchemas = {
  Clothes: {
    type: "object",
    properties: {
      _id: { type: "string" },
      name: { type: "string", example: "Áo Hoodie Essentials" },
      description: { type: "string", example: "Chất liệu nỉ bông cao cấp" },
      price: { type: "number", example: 550000 },
      size: { type: "string", enum: ["S", "M", "L", "XL"], example: "L" },
      color: { type: "string", example: "Black" },
      status: {
        type: "string",
        enum: ["active", "inactive"],
        default: "active",
      },
      category: { type: "string", description: "ID của danh mục" },
      averageRating: { type: "number", example: 4.5 },
      rank: { type: "string", example: "A" },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
  },
  CreateClothesDTO: {
    type: "object",
    required: ["name", "price", "category", "size", "color"],
    properties: {
      name: { type: "string", example: "Áo Hoodie Essentials" },
      description: { type: "string" },
      price: { type: "number", example: 550000 },
      size: { type: "string", enum: ["S", "M", "L", "XL"] },
      color: { type: "string" },
      status: { type: "string", enum: ["active", "inactive"] },
      category: { type: "string", example: "65a7f..." },
    },
  },
  UpdateClothesDTO: {
    type: "object",
    properties: {
      name: { type: "string" },
      description: { type: "string" },
      price: { type: "number" },
      size: { type: "string", enum: ["S", "M", "L", "XL"] },
      color: { type: "string" },
      status: { type: "string", enum: ["active", "inactive"] },
      category: { type: "string" },
    },
  },
};

export const clothesSwagger = {
  "/clothes": {
    get: {
      summary: "Lấy danh sách sản phẩm (có lọc theo category)",
      tags: ["Clothes"],
      parameters: [
        {
          in: "query",
          name: "category",
          schema: { type: "string" },
          description: "ID của danh mục để lọc sản phẩm",
        },
      ],
      responses: {
        200: {
          description: "Danh sách sản phẩm",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: { $ref: "#/components/schemas/Clothes" },
              },
            },
          },
        },
      },
    },
    post: {
      summary: "Đăng sản phẩm mới (Shop Owner/Admin)",
      tags: ["Clothes"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateClothesDTO" },
          },
        },
      },
      responses: {
        201: {
          description: "Tạo thành công",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Clothes" },
            },
          },
        },
      },
    },
  },
  "/clothes/{id}": {
    get: {
      summary: "Xem chi tiết một sản phẩm",
      tags: ["Clothes"],
      parameters: [
        { in: "path", name: "id", required: true, schema: { type: "string" } },
      ],
      responses: {
        200: {
          description: "Thành công",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Clothes" },
            },
          },
        },
      },
    },
    put: {
      summary: "Cập nhật sản phẩm",
      tags: ["Clothes"],
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: "path", name: "id", required: true, schema: { type: "string" } },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UpdateClothesDTO" },
          },
        },
      },
      responses: {
        200: { description: "Cập nhật thành công" },
      },
    },
    delete: {
      summary: "Xóa sản phẩm",
      tags: ["Clothes"],
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: "path", name: "id", required: true, schema: { type: "string" } },
      ],
      responses: {
        200: { description: "Xóa thành công" },
      },
    },
  },
};
