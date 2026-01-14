import { httpResponse } from "../../utils/httpResponse.core";
import { UserGroup } from "../userGroups/userGroup.collection";
import { PermissionSpace } from "./permission.interface";
import { PermissionService } from "./permission.service";

const getGroupIdByGroupName = async (name: string): Promise<string> => {
  const group = await UserGroup.findOne({ name });
  if (!group) throw new Error(`Nhóm '${name}' không tồn tại`);
  return group._id.toString();
};

export const assignRoleToUserAction: PermissionSpace.AssignRoleController =
  async (req, res, next) => {
    try {
      const { username, groupName } = req.body;

      const groupObjectId = await getGroupIdByGroupName(groupName);

      const success = await PermissionService.addGrouping(
        username,
        groupObjectId
      );

      if (!success) {
        return httpResponse.badRequest(res, "Người dùng đã thuộc nhóm này");
      }

      httpResponse.success(res, null, "Gán nhóm thành công");
    } catch (error: any) {
      if (error.message.includes("không tồn tại")) {
        return httpResponse.notFound(res, error.message);
      }
      next(error);
    }
  };

export const assignPermissionToGroupAction: PermissionSpace.AssignPermissionController =
  async (req, res, next) => {
    try {
      const { subject, object, action } = req.body;

      // subject ở đây là groupName
      const groupObjectId = await getGroupIdByGroupName(subject);

      const success = await PermissionService.addPolicies(
        groupObjectId,
        object,
        action
      );

      if (!success) {
        return httpResponse.badRequest(res, "Quyền này đã tồn tại cho nhóm");
      }

      httpResponse.success(res, null, "Gán quyền thành công");
    } catch (error: any) {
      if (error.message.includes("không tồn tại")) {
        return httpResponse.notFound(res, error.message);
      }
      next(error);
    }
  };

export const getAllPermissionsAction: PermissionSpace.GetAllController = async (
  req,
  res,
  next
) => {
  try {
    const data = await PermissionService.getRules();
    httpResponse.success(res, data);
  } catch (error) {
    next(error);
  }
};
