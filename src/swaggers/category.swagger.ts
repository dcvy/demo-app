export const categorySchemas = {
  Category: {
    type: "object",
    properties: {
      _id: { type: "string" },
      name: { type: "string", example: "Áo sơ mi" },
      description: { type: "string", example: "Các loại áo sơ mi nam nữ" },
      status: {
        type: "string",
        enum: ["active", "inactive"],
        default: "active",
      },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
  },
  CreateCategoryDTO: {
    type: "object",
    required: ["name"],
    properties: {
      name: { type: "string", example: "Áo sơ mi" },
      description: { type: "string", example: "Các loại áo sơ mi nam nữ" },
      status: {
        type: "string",
        enum: ["active", "inactive"],
        default: "active",
      },
    },
  },
  UpdateCategoryDTO: {
    type: "object",
    properties: {
      name: { type: "string" },
      description: { type: "string" },
      status: { type: "string", enum: ["active", "inactive"] },
    },
  },
};

export const categorySwagger = {
  "/categories": {
    get: {
      summary: "Lấy danh sách tất cả danh mục",
      tags: ["Categories"],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Trả về mảng các danh mục",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: { $ref: "#/components/schemas/Category" },
              },
            },
          },
        },
      },
    },
    post: {
      summary: "Tạo danh mục mới (Chỉ Shop Owner/Admin)",
      tags: ["Categories"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateCategoryDTO" },
          },
        },
      },
      responses: {
        201: {
          description: "Tạo thành công",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Category" },
            },
          },
        },
      },
    },
  },
  "/categories/{id}": {
    get: {
      summary: "Lấy thông tin chi tiết danh mục",
      tags: ["Categories"],
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: "path", name: "id", required: true, schema: { type: "string" } },
      ],
      responses: {
        200: {
          description: "Thành công",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Category" },
            },
          },
        },
      },
    },
    put: {
      summary: "Cập nhật danh mục",
      tags: ["Categories"],
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: "path", name: "id", required: true, schema: { type: "string" } },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UpdateCategoryDTO" },
          },
        },
      },
      responses: {
        200: { description: "Cập nhật thành công" },
      },
    },
    delete: {
      summary: "Xóa danh mục",
      tags: ["Categories"],
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
