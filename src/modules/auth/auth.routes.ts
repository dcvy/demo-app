import { Application } from "express";
import { body } from "express-validator";
import {
  forgotPasswordAction,
  loginAction,
  logoutAction,
  registerAction,
  renderLoginPageAction,
  renderRegisterPageAction,
} from "./auth.controller";

/**
 * @swagger
 * tags:
 *   - name: Auths
 *     description: Quản lý xác thực người dùng
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Đăng ký tài khoản (API)
 *     tags: [Auths]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: admin123456
 *               confirmPassword:
 *                 type: string
 *                 example: admin123456
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Đăng nhập hệ thống
 *     tags:
 *       - Auths
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: admin123456
 *     responses:
 *       200:
 *         description: Đăng nhập thành công (trả về JWT)
 *       401:
 *         description: Sai thông tin đăng nhập
 */

/**
 * @swagger
 * /forgot-password:
 *   post:
 *     summary: Gửi email reset mật khẩu
 *     tags:
 *       - Auths
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Email reset mật khẩu đã được gửi
 *       400:
 *         description: Email không hợp lệ
 */

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Đăng xuất người dùng
 *     tags:
 *       - Auths
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 */
export default (app: Application) => {
  app.get("/be/login", renderLoginPageAction);
  app.get("/be/register", renderRegisterPageAction);

  app.post(
    "/register",
    [
      body("username").notEmpty().withMessage("Tên tài khoản bắt buộc"),
      body("email").isEmail().withMessage("Email không hợp lệ"),
      body("password")
        .isLength({ min: 6 })
        .withMessage("Mật khẩu tối thiểu 6 ký tự"),
      body("confirmPassword").custom((value, { req }) => {
        if (value !== req.body.password) throw new Error("Mật khẩu không khớp");
        return true;
      }),
    ],
    registerAction
  );

  app.post("/login", loginAction);

  app.post(
    "/forgot-password",
    [body("email").isEmail().withMessage("Vui lòng nhập email hợp lệ")],
    forgotPasswordAction
  );

  app.post("/logout", logoutAction);
};
