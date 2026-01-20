export const userGroupSchemas = {
  UserGroup: {
    type: "object",
    properties: {
      _id: { type: "string" },
      name: { type: "string", example: "manager" },
      description: {
        type: "string",
        example: "Nhóm quản lý có quyền duyệt bài",
      },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
  },
  CreateUserGroupDTO: {
    type: "object",
    required: ["name"],
    properties: {
      name: { type: "string", example: "manager" },
      description: {
        type: "string",
        example: "Nhóm quản lý có quyền duyệt bài",
      },
    },
  },
  UpdateUserGroupDTO: {
    type: "object",
    properties: {
      name: { type: "string" },
      description: { type: "string" },
    },
  },
};

export const userGroupSwagger = {
  "/user-groups": {
    get: {
      summary: "Lấy danh sách tất cả nhóm người dùng",
      tags: ["UserGroups"],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Trả về mảng các nhóm người dùng",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: { $ref: "#/components/schemas/UserGroup" },
              },
            },
          },
        },
      },
    },
    post: {
      summary: "Tạo nhóm người dùng mới",
      tags: ["UserGroups"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateUserGroupDTO" },
          },
        },
      },
      responses: {
        201: { description: "Tạo nhóm thành công" },
        400: { description: "Tên nhóm đã tồn tại" },
      },
    },
  },
  "/user-groups/{id}": {
    get: {
      summary: "Lấy thông tin chi tiết nhóm người dùng",
      tags: ["UserGroups"],
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: "path", name: "id", required: true, schema: { type: "string" } },
      ],
      responses: {
        200: {
          description: "Chi tiết nhóm",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UserGroup" },
            },
          },
        },
        404: { description: "Không tìm thấy nhóm" },
      },
    },
    put: {
      summary: "Cập nhật nhóm người dùng",
      tags: ["UserGroups"],
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: "path", name: "id", required: true, schema: { type: "string" } },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UpdateUserGroupDTO" },
          },
        },
      },
      responses: {
        200: { description: "Cập nhật thành công" },
      },
    },
    delete: {
      summary: "Xóa nhóm người dùng",
      tags: ["UserGroups"],
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: "path", name: "id", required: true, schema: { type: "string" } },
      ],
      responses: {
        200: { description: "Xóa nhóm thành công" },
      },
    },
  },
};
