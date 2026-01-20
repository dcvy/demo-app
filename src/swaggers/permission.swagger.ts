export const permissionSchemas = {
  AssignPermissionDTO: {
    type: "object",
    required: ["subject", "object", "action"],
    properties: {
      subject: {
        type: "string",
        description: "Tên nhóm (role) trong Casbin",
        example: "admin_full",
      },
      object: {
        type: "string",
        description: "Tài nguyên (hỗ trợ wildcard *)",
        example: "/permissions*",
      },
      action: {
        type: "string",
        description: "Hành động (GET, POST, PUT, DELETE hoặc *)",
        example: "POST",
      },
    },
  },
  AssignRoleDTO: {
    type: "object",
    required: ["username", "groupName"],
    properties: {
      username: { type: "string", example: "staff_01" },
      groupName: {
        type: "string",
        description: "Tên nhóm quyền muốn gán user vào",
        example: "admin_full",
      },
    },
  },
  PermissionResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      data: {
        type: "object",
        properties: {
          policies: {
            type: "array",
            description: "Danh sách policy định nghĩa quyền (p)",
            items: { type: "array", items: { type: "string" } },
          },
          groupingPolicies: {
            type: "array",
            description: "Danh sách mapping User-Role (g)",
            items: { type: "array", items: { type: "string" } },
          },
        },
      },
    },
  },
};

export const permissionSwagger = {
  "/permissions/assign-group": {
    post: {
      summary: "Gán quyền (Policy) cho một nhóm người dùng",
      tags: ["Permissions"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/AssignPermissionDTO" },
          },
        },
      },
      responses: {
        200: { description: "Gán quyền thành công" },
        400: { description: "Quyền đã tồn tại hoặc dữ liệu lỗi" },
        403: { description: "Không có quyền thực hiện hành động này" },
      },
    },
  },
  "/permissions/assign-user": {
    post: {
      summary: "Gán người dùng vào nhóm quyền (Role Mapping)",
      tags: ["Permissions"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/AssignRoleDTO" },
          },
        },
      },
      responses: {
        200: { description: "Gán user vào nhóm thành công" },
        404: { description: "Không tìm thấy người dùng hoặc nhóm" },
      },
    },
  },
  "/permissions": {
    get: {
      summary: "Lấy toàn bộ danh sách policy & grouping policy",
      tags: ["Permissions"],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Danh sách quyền trong hệ thống",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PermissionResponse" },
            },
          },
        },
      },
    },
  },
};
