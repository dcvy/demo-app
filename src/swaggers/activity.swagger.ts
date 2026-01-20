export const activitySchemas = {
  Activity: {
    type: "object",
    properties: {
      _id: { type: "string" },
      clothes: { type: "string", description: "ID của sản phẩm" },
      author: { type: "string", description: "ID của người bình luận" },
      content: { type: "string", example: "Sản phẩm rất đẹp, vải mát!" },
      rating: { type: "number", example: 5, minimum: 1, maximum: 5 },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
  },
  CreateActivityDTO: {
    type: "object",
    required: ["clothes", "content"],
    properties: {
      clothes: { type: "string", example: "65a7f..." },
      content: { type: "string", example: "Chất lượng tuyệt vời!" },
      rating: { type: "number", example: 5, default: 5 },
      type: { type: "string", example: "comment", default: "comment" },
    },
  },
};

export const activitySwagger = {
  "/activities": {
    post: {
      summary: "Tạo bình luận/đánh giá mới cho sản phẩm",
      tags: ["Activities"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateActivityDTO" },
          },
        },
      },
      responses: {
        201: {
          description: "Đăng bình luận thành công",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Activity" },
            },
          },
        },
      },
    },
  },
  "/activities/{clothesId}": {
    get: {
      summary: "Lấy danh sách bình luận của một sản phẩm",
      tags: ["Activities"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "clothesId",
          required: true,
          schema: { type: "string" },
          description: "ID của sản phẩm cần lấy bình luận",
        },
      ],
      responses: {
        200: {
          description: "Danh sách bình luận",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: { $ref: "#/components/schemas/Activity" },
              },
            },
          },
        },
      },
    },
  },
};
