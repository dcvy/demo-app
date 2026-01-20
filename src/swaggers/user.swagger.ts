export const userSchemas = {
  User: {
    type: "object",
    properties: {
      _id: { type: "string" },
      username: { type: "string", example: "vydoan" },
      fullName: { type: "string", example: "Võ Văn Vy" },
      email: { type: "string", example: "vy.doan@example.com" },
      gender: { type: "string", enum: ["Nam", "Nữ", "Khác"] },
      birthYear: { type: "number", example: 1998 },
      address: { type: "string", example: "Đà Nẵng, Việt Nam" },
      userGroup: {
        type: "array",
        items: { type: "string" },
        description: "Danh sách ID của các nhóm người dùng",
      },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
  },
  CreateUserDTO: {
    type: "object",
    required: ["username", "fullName", "email", "password"],
    properties: {
      username: { type: "string", example: "vydoan" },
      fullName: { type: "string", example: "Võ Văn Vy" },
      email: { type: "string", example: "vy.doan@example.com" },
      password: { type: "string", example: "admin123" },
      gender: { type: "string", enum: ["Nam", "Nữ", "Khác"] },
      birthYear: { type: "number" },
      address: { type: "string" },
      userGroup: { type: "array", items: { type: "string" } },
    },
  },
  UpdateUserDTO: {
    type: "object",
    properties: {
      fullName: { type: "string" },
      email: { type: "string" },
      password: { type: "string" },
      gender: { type: "string", enum: ["Nam", "Nữ", "Khác"] },
      birthYear: { type: "number" },
      address: { type: "string" },
      userGroup: { type: "array", items: { type: "string" } },
    },
  },
};

export const userSwagger = {
  "/users": {
    get: {
      summary: "Lấy danh sách người dùng",
      tags: ["Users"],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Trả về danh sách người dùng",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: { $ref: "#/components/schemas/User" },
              },
            },
          },
        },
        403: { description: "Không có quyền truy cập" },
      },
    },
    post: {
      summary: "Tạo người dùng mới",
      tags: ["Users"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateUserDTO" },
          },
        },
      },
      responses: {
        201: { description: "Tạo người dùng thành công" },
        400: { description: "Dữ liệu không hợp lệ" },
      },
    },
  },
  "/users/{id}": {
    get: {
      summary: "Lấy chi tiết người dùng",
      tags: ["Users"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "string" },
          example: "65f12a9c1b2c3d4e5f678901",
        },
      ],
      responses: {
        200: {
          description: "Lấy chi tiết thành công",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/User" },
            },
          },
        },
        404: { description: "Không tìm thấy người dùng" },
      },
    },
    put: {
      summary: "Cập nhật người dùng",
      tags: ["Users"],
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: "path", name: "id", required: true, schema: { type: "string" } },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UpdateUserDTO" },
          },
        },
      },
      responses: {
        200: { description: "Cập nhật thành công" },
      },
    },
    delete: {
      summary: "Xóa người dùng",
      tags: ["Users"],
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: "path", name: "id", required: true, schema: { type: "string" } },
      ],
      responses: {
        200: { description: "Xóa thành công" },
        403: { description: "Không có quyền xóa" },
      },
    },
  },
};
