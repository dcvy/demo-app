import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { UserService } from "./user.service";
import { getEnforcer } from "../../casbin";
import {
  ICreateUserDTO,
  IUpdateUserDTO,
  IUserResponse,
} from "./user.interface";
import bcrypt from "bcryptjs";

export class UserController {
  static async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users: IUserResponse[] = await UserService.getAllUsers();
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      next({ status: 500, message: "Lỗi khi lấy danh sách người dùng", error });
    }
  }

  static async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "Thiếu User ID" });
      }
      const user: IUserResponse | null = await UserService.getUserById(id);

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy người dùng" });
      }

      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next({ status: 400, message: "ID không hợp lệ", error });
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const data: ICreateUserDTO = req.body;
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
      const newUser: IUserResponse = await UserService.createUser(data);

      const groupsToAssign =
        data.userGroup && data.userGroup.length > 0 ? data.userGroup : [];

      if (groupsToAssign.length > 0) {
        const enforcer = await getEnforcer();

        await Promise.all(
          groupsToAssign.map((groupId) =>
            enforcer.addGroupingPolicy(newUser.username, groupId.toString())
          )
        );

        await enforcer.savePolicy();
      }

      res.status(201).json({
        success: true,
        message: "Tạo người dùng thành công và đã phân quyền cho các nhóm",
        data: newUser,
      });
    } catch (error: any) {
      if (error.code === 11000) {
        return res
          .status(400)
          .json({ success: false, message: "Username hoặc email đã tồn tại" });
      }
      next({ status: 500, message: "Lỗi khi tạo người dùng", error });
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "Thiếu User ID" });
      }
      const updateData: IUpdateUserDTO = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const updatedUser: IUserResponse | null = await UserService.updateUser(
        id,
        updateData
      );

      if (!updatedUser) {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy người dùng" });
      }

      res.status(200).json({
        success: true,
        message: "Cập nhật người dùng thành công",
        data: updatedUser,
      });
    } catch (error: any) {
      if (error.code === 11000) {
        return res
          .status(400)
          .json({ success: false, message: "Username hoặc email đã tồn tại" });
      }
      next({ status: 500, message: "Lỗi khi cập nhật người dùng", error });
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "Thiếu User ID" });
      }

      const deletedUser: IUserResponse | null = await UserService.deleteUser(
        id
      );

      if (!deletedUser) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy người dùng để xóa",
        });
      }

      const enforcer = await getEnforcer();
      await enforcer.removeFilteredGroupingPolicy(0, deletedUser.username);

      res.status(200).json({
        success: true,
        message: `Đã xóa người dùng: ${deletedUser.username} và gỡ bỏ quyền hạn.`,
      });
    } catch (error) {
      next({ status: 500, message: "Lỗi khi xóa người dùng", error });
    }
  }
}
