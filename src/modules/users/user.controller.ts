import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import { Types } from "mongoose";
import casbinInstance from "../../casbin";
import { httpResponse } from "../../utils/httpResponse.core";
import { UserSpace } from "./user.interface";
import { UserService } from "./user.service";

export const getUsersAction: UserSpace.GetAllController = async (
  req,
  res,
  next
) => {
  try {
    const users = await UserService.getAllUsers();
    httpResponse.success(res, users);
  } catch (error) {
    next(error);
  }
};

export const getUserByIdAction: UserSpace.GetByIdController = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const user = await UserService.getUserById(id);

    if (!user) return httpResponse.notFound(res, "Không tìm thấy người dùng");

    httpResponse.success(res, user);
  } catch (error) {
    next(error);
  }
};

export const createUserAction: UserSpace.CreateController = async (
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

    const data = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const payload = {
      ...data,
      password: hashedPassword,
      userGroup: data.userGroup
        ? data.userGroup.map((id) => new Types.ObjectId(id))
        : [],
    };

    const newUser = await UserService.createUser(payload);

    if (data.userGroup && data.userGroup.length > 0) {
      const enforcer = casbinInstance.enforcer;
      await Promise.all(
        data.userGroup.map((groupName) =>
          enforcer.addGroupingPolicy(newUser.username, groupName.toString())
        )
      );
      await enforcer.savePolicy();
    }

    httpResponse.created(
      res,
      newUser,
      "Tạo người dùng và phân quyền thành công"
    );
  } catch (error: any) {
    if (error.code === 11000)
      return httpResponse.badRequest(res, "Username hoặc email đã tồn tại");
    next(error);
  }
};

export const updateUserAction: UserSpace.UpdateController = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return httpResponse.badRequest(
        res,
        "Dữ liệu không hợp lệ",
        errors.array()
      );

    const updatedUser = await UserService.updateUser(id, req.body);
    if (!updatedUser)
      return httpResponse.notFound(res, "Không tìm thấy người dùng");

    httpResponse.success(res, updatedUser, "Cập nhật thành công");
  } catch (error: any) {
    if (error.code === 11000)
      return httpResponse.badRequest(res, "Username hoặc email đã tồn tại");
    next(error);
  }
};

export const deleteUserAction: UserSpace.DeleteController = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const deletedUser = await UserService.deleteUser(id);

    if (!deletedUser)
      return httpResponse.notFound(res, "Không tìm thấy người dùng để xóa");

    const enforcer = casbinInstance.enforcer;
    await enforcer.removeFilteredGroupingPolicy(0, deletedUser.username);

    httpResponse.success(
      res,
      null,
      `Đã xóa người dùng: ${deletedUser.username}`
    );
  } catch (error) {
    next(error);
  }
};
