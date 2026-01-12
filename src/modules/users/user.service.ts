import { IUser, ICreateUserDTO, IUpdateUserDTO } from "./user.interface";
import { User } from "./user.collection";

export class UserService {
  static async getAllUsers(): Promise<IUser[]> {
    return await User.find().lean();
  }

  static async getUserById(id: string): Promise<IUser | null> {
    return await User.findById(id).lean();
  }

  static async createUser(data: ICreateUserDTO): Promise<IUser> {
    const newUser = await User.create(data);
    return newUser.toObject();
  }

  static async updateUser(
    id: string,
    data: IUpdateUserDTO
  ): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();
  }

  static async deleteUser(id: string): Promise<IUser | null> {
    return await User.findByIdAndDelete(id).lean();
  }
}
