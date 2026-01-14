import { User } from "./user.collection";
import { IUpdateUserDTO, IUserResponse } from "./user.interface";

export class UserService {
  static async getAllUsers(): Promise<IUserResponse[]> {
    return await User.find().sort({ createdAt: -1 }).lean();
  }

  static async getUserById(id: string): Promise<IUserResponse | null> {
    return await User.findById(id).lean();
  }

  static async createUser(data: any): Promise<IUserResponse> {
    const newUser = await User.create(data);
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
