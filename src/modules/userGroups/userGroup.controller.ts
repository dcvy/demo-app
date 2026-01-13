import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { UserGroupService } from "./userGroup.service";
import { getEnforcer } from "../../casbin";

export class UserGroupController {
  static async getUserGroups(req: Request, res: Response, next: NextFunction) {
    try {
      const groups = await UserGroupService.getAll();
      res.status(200).json({ success: true, data: groups });
    } catch (error) {
      next(error);
    }
  }

  static async getUserGroupById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ message: "ID là bắt buộc" });
      const group = await UserGroupService.getById(id);
      if (!group)
        return res
          .status(404)
          .json({ message: "Không tìm thấy nhóm người dùng" });
      res.status(200).json({ success: true, data: group });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      const { name, description } = req.body;

      const existing = await UserGroupService.findByName(name);
      if (existing)
        return res
          .status(400)
          .json({ message: "Tên nhóm người dùng đã tồn tại" });

      const newGroup = await UserGroupService.create({ name, description });

      res.status(201).json({
        success: true,
        message: "Tạo nhóm người dùng thành công",
        data: newGroup,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ message: "ID là bắt buộc" });

      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      const updated = await UserGroupService.update(id, req.body);

      if (!updated)
        return res.status(404).json({ message: "Không tìm thấy để cập nhật" });
      res.json({
        success: true,
        message: "Cập nhật thành công",
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ message: "ID là bắt buộc" });

      const groupToDelete = await UserGroupService.getById(id);
      if (!groupToDelete)
        return res.status(404).json({ message: "Không tìm thấy để xóa" });

      await UserGroupService.delete(id);

      const enforcer = await getEnforcer();
      await enforcer.removeFilteredPolicy(0, groupToDelete.name || "");
      await enforcer.removeFilteredGroupingPolicy(1, groupToDelete.name || "");

      res.json({ success: true, message: `Đã xóa nhóm ${groupToDelete.name}` });
    } catch (error) {
      next(error);
    }
  }
}
