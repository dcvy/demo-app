import jwt from "jsonwebtoken";
import { User } from "../users/user.collection";

export class AuthService {
  static async findUserByAuth(usernameOrEmail: string) {
    return await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    }).select("+password");
  }

  static async findByEmail(email: string) {
    return await User.findOne({ email });
  }

  static async createUser(data: any) {
    return await User.create(data);
  }

  static generateToken(payload: object) {
    const JWT_SECRET = process.env.JWT_SECRET || "secret";
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "8h" });
  }
}
