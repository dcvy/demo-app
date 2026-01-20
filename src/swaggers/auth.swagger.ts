export const authSchemas = {
  LoginDTO: {
    type: "object",
    required: ["username", "password"],
    properties: {
      username: { type: "string", example: "admin" },
      password: { type: "string", example: "123456" },
    },
  },
  RegisterDTO: {
    type: "object",
    required: ["username", "email", "password", "confirmPassword"],
    properties: {
      username: { type: "string", example: "newuser" },
      email: { type: "string", example: "user@example.com" },
      password: { type: "string", example: "123456" },
      confirmPassword: { type: "string", example: "123456" },
    },
  },
  ForgotPasswordDTO: {
    type: "object",
    required: ["email"],
    properties: {
      email: { type: "string", example: "user@example.com" },
    },
  },
  AuthResponse: {
    type: "object",
    properties: {
      message: { type: "string" },
      token: { type: "string", description: "JWT Access Token" },
      user: {
        type: "object",
        properties: {
          id: { type: "string" },
          username: { type: "string" },
          email: { type: "string" },
        },
      },
    },
  },
};

export const authSwagger = {
  "/register": {
    post: {
      summary: "Đăng ký tài khoản mới",
      tags: ["Auths"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/RegisterDTO" },
          },
        },
      },
      responses: {
        201: { description: "Đăng ký thành công" },
        400: { description: "Dữ liệu đầu vào không hợp lệ" },
      },
    },
  },
  "/login": {
    post: {
      summary: "Đăng nhập hệ thống",
      tags: ["Auths"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/LoginDTO" },
          },
        },
      },
      responses: {
        200: {
          description: "Đăng nhập thành công",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthResponse" },
            },
          },
        },
        401: { description: "Sai tài khoản hoặc mật khẩu" },
      },
    },
  },
  "/forgot-password": {
    post: {
      summary: "Yêu cầu khôi phục mật khẩu qua email",
      tags: ["Auths"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ForgotPasswordDTO" },
          },
        },
      },
      responses: {
        200: { description: "Đã gửi email khôi phục" },
        404: { description: "Email không tồn tại trong hệ thống" },
      },
    },
  },
  "/logout": {
    post: {
      summary: "Đăng xuất người dùng",
      tags: ["Auths"],
      responses: {
        200: { description: "Đăng xuất thành công" },
      },
    },
  },
};
