import { validationResult } from "express-validator";
import casbinInstance from "../../casbin";
import { httpResponse } from "../../utils/httpResponse.core";
import { ICreateUserGroupDTO, UserGroupSpace } from "./userGroup.interface";
import { UserGroupService } from "./userGroup.service";

export const getUserGroupsAction: UserGroupSpace.GetAllController = async (
  req,
  res,
  next
) => {
  try {
    const groups = await UserGroupService.getAll();
    httpResponse.success(res, groups);
  } catch (error) {
    next(error);
  }
};

export const getUserGroupByIdAction: UserGroupSpace.GetByIdController = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    if (!id) return httpResponse.badRequest(res, "ID là bắt buộc");

    const group = await UserGroupService.getById(id);
    if (!group)
      return httpResponse.notFound(res, "Không tìm thấy nhóm người dùng");

    httpResponse.success(res, group);
  } catch (error) {
    next(error);
  }
};

export const createUserGroupAction: UserGroupSpace.CreateController = async (
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

    const { name, description } = req.body;

    const existing = await UserGroupService.findByName(name);
    if (existing)
      return httpResponse.badRequest(res, "Tên nhóm người dùng đã tồn tại");

    const payload: ICreateUserGroupDTO = { name };

    if (description !== undefined) {
      payload.description = description;
    }

    const newGroup = await UserGroupService.create(payload);

    httpResponse.created(res, newGroup, "Tạo nhóm người dùng thành công");
  } catch (error) {
    next(error);
  }
};

export const updateUserGroupAction: UserGroupSpace.UpdateController = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    if (!id) return httpResponse.badRequest(res, "ID là bắt buộc");

    const errors = validationResult(req);
    if (!errors.isEmpty())
      return httpResponse.badRequest(
        res,
        "Dữ liệu không hợp lệ",
        errors.array()
      );

    const oldGroup = await UserGroupService.getById(id);
    if (!oldGroup)
      return httpResponse.notFound(res, "Không tìm thấy để cập nhật");

    const oldName = oldGroup.name;

    if (req.body.name && req.body.name !== oldName) {
      const existing = await UserGroupService.findByName(req.body.name);
      if (existing && existing._id?.toString() !== id) {
        httpResponse.badRequest(res, "Tên nhóm người dùng mới đã tồn tại");
      }
    }

    const updated = await UserGroupService.update(id, req.body);
    if (!updated)
      return httpResponse.notFound(res, "Không tìm thấy để cập nhật");

    const newName = updated.name;

    if (req.body.name && newName !== oldName) {
      const enforcer = casbinInstance.enforcer;

      const oldGroupings = await enforcer.getFilteredGroupingPolicy(1, oldName);
      const oldPolicies = await enforcer.getFilteredPolicy(0, oldName);

      await enforcer.removeFilteredGroupingPolicy(1, oldName);
      await enforcer.removeFilteredPolicy(0, oldName);

      for (const grouping of oldGroupings) {
        const newGrouping = [grouping[0], newName, ...grouping.slice(2)].filter(
          (v): v is string => typeof v === "string"
        );
        await enforcer.addGroupingPolicy(...newGrouping);
      }

      for (const policy of oldPolicies) {
        const newPolicy = [newName, ...policy.slice(1)];
        await enforcer.addPolicy(...newPolicy);
      }

      console.log(`✅ Casbin: Đã rename role "${oldName}" → "${newName}"`);
    }

    res.json({
      success: true,
      message: "Cập nhật thành công",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUserGroupAction: UserGroupSpace.DeleteController = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    if (!id) return httpResponse.badRequest(res, "ID là bắt buộc");

    const groupToDelete = await UserGroupService.getById(id);
    if (!groupToDelete)
      return httpResponse.notFound(res, "Không tìm thấy để xóa");

    await UserGroupService.delete(id);

    const enforcer = casbinInstance.enforcer;
    await enforcer.removeFilteredPolicy(0, groupToDelete.name || "");
    await enforcer.removeFilteredGroupingPolicy(1, groupToDelete.name || "");

    res.json({ success: true, message: `Đã xóa nhóm ${groupToDelete.name}` });
  } catch (error) {
    next(error);
  }
};
