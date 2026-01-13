import { Request, Response, NextFunction } from "express";
import path from "path";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";

import { User } from "../users/user.collection";
import { IUser, ICreateUserDTO } from "../users/user.interface";

import { getEnforcer } from "../../casbin";

export class AuthController {
  static renderLoginPage(req: Request, res: Response) {
    res.sendFile(path.join(process.cwd(), "/src/public/pages/login.html"));
  }

  static renderRegisterPage(req: Request, res: Response) {
    res.sendFile(path.join(process.cwd(), "/src/public/pages/register.html"));
  }

  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, fullName, email, password }: ICreateUserDTO = req.body;

      const existingUser = await User.findOne({
        $or: [{ username }, { email }],
      });

      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Username hoặc email đã tồn tại" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        username,
        fullName,
        email,
        password: hashedPassword,
      });

      await newUser.save();

      res.status(201).json({
        success: true,
        message: "Đăng ký thành công! Quyền truy cập đã được thiết lập.",
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, password } = req.body;

      const user = await User.findOne({ username }).select("+password");

      if (!user) {
        return res.status(401).json({ message: "Sai thông tin đăng nhập" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Sai thông tin đăng nhập" });
      }

      const JWT_SECRET = process.env.JWT_SECRET || "secret";
      const token = jwt.sign(
        { username: user.username, id: user._id },
        JWT_SECRET,
        { expiresIn: "8h" }
      );

      res.json({
        success: true,
        message: "Đăng nhập thành công",
        token,
        userGroup: user.userGroup,
      });
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "Email không tồn tại" });
      }

      const newPass = Math.random().toString(36).slice(-8);
      user.password = await bcrypt.hash(newPass, 10);
      await user.save();
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response) {
    res
      .status(200)
      .json({ success: true, message: "Đã đăng xuất thành công!" });
  }
}
