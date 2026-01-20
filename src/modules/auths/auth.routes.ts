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
