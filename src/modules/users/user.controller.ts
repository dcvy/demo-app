import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service";

export class UserController {
  static async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      next({ status: 500, message: "Lỗi khi lấy danh sách người dùng", error });
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, age } = req.body;

      if (!name || !email) {
        return res.status(400).json({ message: "Name và Email là bắt buộc" });
      }

      const newUser = await UserService.createUser({ name, email, age });
      res.status(201).json({
        success: true,
        message: "Tạo người dùng thành công",
        data: newUser,
      });
    } catch (error) {
      next({ status: 400, message: "Lỗi khi tạo người dùng", error });
    }
  }

  static async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: "Thiếu ID người dùng" });
      }

      const user = await UserService.getUserById(id);

      if (!user) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }

      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next({ status: 400, message: "ID không hợp lệ", error });
    }
  }
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "Thiếu ID người dùng" });
      }
      const updateData = req.body;

      const updatedUser = await UserService.updateUser(id, updateData);

      if (!updatedUser) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy người dùng để cập nhật" });
      }

      res.status(200).json({
        success: true,
        message: "Cập nhật thành công",
        data: updatedUser,
      });
    } catch (error) {
      next({ status: 400, message: "Lỗi khi cập nhật", error });
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "Thiếu ID người dùng" });
      }
      const deletedUser = await UserService.deleteUser(id);

      if (!deletedUser) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy người dùng để xóa" });
      }

      res.status(200).json({
        success: true,
        message: `Đã xóa người dùng: ${deletedUser.name}`,
      });
    } catch (error) {
      next({ status: 400, message: "Lỗi khi xóa người dùng", error });
    }
  }
}
