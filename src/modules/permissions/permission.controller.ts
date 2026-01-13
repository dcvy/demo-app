import { Request, Response, NextFunction } from "express";
import { PermissionService } from "./permission.service";
import { UserGroup } from "../userGroups/userGroup.collection";
import { IAssignPermissionDTO, IAssignRoleDTO } from "./permission.interface";

export class PermissionController {
  private static async getGroupIdByGroupName(name: string): Promise<string> {
    const group = await UserGroup.findOne({ name });
    if (!group) throw new Error(`Nhóm '${name}' không tồn tại`);
    return group._id.toString();
  }

  static async assignRoleToUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data: IAssignRoleDTO = req.body;

      const groupObjectId = await PermissionController.getGroupIdByGroupName(
        data.groupName
      );

      const success = await PermissionService.addGroupingPolicy(
        data.username,
        groupObjectId
      );

      if (!success)
        return res
          .status(400)
          .json({ success: false, message: "User đã thuộc nhóm này" });
      res.json({ success: true, message: "Gán nhóm thành công" });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  static async assignPermissionToGroup(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data: IAssignPermissionDTO = req.body;

      const groupObjectId = await PermissionController.getGroupIdByGroupName(
        data.subject
      );

      const success = await PermissionService.addPolicy(
        groupObjectId,
        data.object,
        data.action
      );

      if (!success)
        return res
          .status(400)
          .json({ success: false, message: "Quyền đã tồn tại" });
      res.json({ success: true, message: "Gán quyền thành công" });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  static async getAllPermissions(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = await PermissionService.getRules();
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}
