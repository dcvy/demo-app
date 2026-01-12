import { Request, Response, NextFunction } from "express";
import path from "path";
import jwt from "jsonwebtoken";
import { User } from "../users/user.collection";
export class AuthController {
  static renderLoginPage(req: Request, res: Response) {
    res.sendFile(path.join(process.cwd(), "/src/public/pages/login.html"));
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;

      if (!name) {
        return res
          .status(400)
          .json({ message: "Vui lòng cung cấp tên đăng nhập" });
      }

      let user = await User.findOne({ name });

      if (!user) {
        return res.status(400).json({ message: "Không tìm thấy user" });
      }

      const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

      const token = jwt.sign(
        {
          id: user._id,
          name: user.name,
        },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({
        success: true,
        message: "Đăng nhập thành công!",
        token,
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json({ success: true, message: "Đã đăng xuất" });
    } catch (error) {
      next(error);
    }
  }
}
