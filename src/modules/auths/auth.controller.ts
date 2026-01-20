import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import path from "path";
import { httpResponse } from "../../utils/httpResponse.core";
import { AuthSpace } from "./auth.interface";
import { AuthService } from "./auth.service";

export const renderLoginPageAction: AuthSpace.RenderPageController = async (
  req,
  res
) => {
  res.sendFile(path.join(process.cwd(), "/src/public/pages/login.html"));
};

export const renderRegisterPageAction: AuthSpace.RenderPageController = async (
  req,
  res
) => {
  res.sendFile(path.join(process.cwd(), "/src/public/pages/register.html"));
};

export const registerAction: AuthSpace.RegisterController = async (
  req,
  res,
  next
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return httpResponse.badRequest(
        res,
        "Dữ liệu không hợp lệ",
        errors.array()
      );

    const { username, fullName, email, password } = req.body;

    const existingUser = await AuthService.findUserByAuth(username);
    if (existingUser)
      return httpResponse.badRequest(res, "Username hoặc email đã tồn tại");

    const hashedPassword = await bcrypt.hash(password, 10);
    await AuthService.createUser({
      username,
      fullName,
      email,
      password: hashedPassword,
    });

    httpResponse.created(res, null, "Đăng ký thành công!");
  } catch (error) {
    next(error);
  }
};

export const loginAction: AuthSpace.LoginController = async (
  req,
  res,
  next
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return httpResponse.badRequest(
        res,
        "Dữ liệu không hợp lệ",
        errors.array()
      );

    const { username, password } = req.body;

    const user = await AuthService.findUserByAuth(username);
    if (!user) return httpResponse.unauthorized(res, "Sai thông tin đăng nhập");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return httpResponse.unauthorized(res, "Sai thông tin đăng nhập");

    const token = AuthService.generateToken({
      username: user.username,
      id: user._id,
    });

    httpResponse.success(
      res,
      {
        token,
        userGroup: user.userGroup,
      },
      "Đăng nhập thành công"
    );
  } catch (error) {
    next(error);
  }
};

export const forgotPasswordAction: AuthSpace.ForgotPasswordController = async (
  req,
  res,
  next
) => {
  try {
    const { email } = req.body;
    const user = await AuthService.findByEmail(email);

    if (!user) return httpResponse.notFound(res, "Email không tồn tại");

    const newPass = Math.random().toString(36).slice(-8);
    user.password = await bcrypt.hash(newPass, 10);
    await user.save();

    httpResponse.success(res, null, "Mật khẩu mới đã được gửi (giả định)");
  } catch (error) {
    next(error);
  }
};

export const logoutAction: AuthSpace.LogoutController = async (req, res) => {
  httpResponse.success(res, null, "Đã đăng xuất thành công!");
};
