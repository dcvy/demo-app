import { IUser, ICreateUserDTO, IUpdateUserDTO } from "./user.interface";
import { User } from "./user.collection";
import { IUserResponse } from "../users/user.interface";
import { Types } from "mongoose";

export class UserService {
  static async getAllUsers(): Promise<IUserResponse[]> {
    return await User.find().lean();
  }

  static async getUserById(id: string): Promise<IUserResponse | null> {
    return await User.findById(id).lean();
  }

  static async createUser(data: ICreateUserDTO): Promise<IUserResponse> {
    const formattedData = {
      ...data,
      userGroup: data.userGroup
        ? data.userGroup.map((id) => new Types.ObjectId(id))
        : [],
    };

    const newUser = await User.create(formattedData);
    return newUser.toObject() as IUserResponse;
  }
  static async updateUser(
    id: string,
    data: IUpdateUserDTO
  ): Promise<IUserResponse | null> {
    return await User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();
  }

  static async deleteUser(id: string): Promise<IUserResponse | null> {
    return await User.findByIdAndDelete(id).lean();
  }
}
