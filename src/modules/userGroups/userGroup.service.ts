import { UserGroup } from "./userGroup.collection";
import {
  ICreateUserGroupDTO,
  IUpdateUserGroupDTO,
} from "./userGroup.interface";

export class UserGroupService {
  static async getAll() {
    return await UserGroup.find().sort({ createdAt: -1 });
  }

  static async getById(id: string) {
    return await UserGroup.findById(id);
  }

  static async create(data: ICreateUserGroupDTO) {
    const newGroup = new UserGroup(data);
    return await newGroup.save();
  }

  static async update(id: string, data: IUpdateUserGroupDTO) {
    return await UserGroup.findByIdAndUpdate(id, data, { new: true });
  }

  static async delete(id: string) {
    return await UserGroup.findByIdAndDelete(id);
  }

  static async findByName(name: string) {
    return await UserGroup.findOne({ name });
  }
}
