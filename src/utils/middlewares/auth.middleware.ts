import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../../modules/users/user.collection";
import { getEnforcer } from "../../casbin";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

  if (!token) {
    return res.status(401).json({
      message: "Bạn cần đăng nhập để truy cập!",
    });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET chưa được cấu hình");
    }
    const decoded = jwt.verify(token, secret) as any;
    const user = await User.findOne({ username: decoded.username }).select(
      "-password"
    );

    if (!user) {
      return res.status(401).json({
        message: "Người dùng không tồn tại hoặc token không hợp lệ!",
      });
    }

    (req as any).user = {
      _id: user._id.toString(),
      username: user.username,
      userGroup: user.userGroup,
    };

    next();
  } catch (error) {
    console.error("Verify token error:", error);
    return res.status(403).json({
      message: "Token không hợp lệ hoặc đã hết hạn!",
    });
  }
};

export const checkPermission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const enforcer = await getEnforcer();

    const sub = user.username;
    const obj = req.baseUrl + req.path;
    const act = req.method;

    if (user.userGroup && Array.isArray(user.userGroup)) {
      for (const groupId of user.userGroup) {
        const hasG = await enforcer.hasGroupingPolicy(sub, groupId.toString());
        if (!hasG) {
          await enforcer.addGroupingPolicy(sub, groupId.toString());
        }
      }
    }

    const allowed = await enforcer.enforce(sub, obj, act);

    if (process.env.NODE_ENV !== "production") {
      console.log(
        `Check: Sub=${sub}, Obj=${obj}, Act=${act} => Allowed=${allowed}`
      );
    }

    if (allowed) {
      return next();
    }

    return res.status(403).json({
      message: "Bạn không có quyền thực hiện hành động này",
    });
  } catch (error) {
    console.error("Casbin enforce error:", error);
    return res.status(500).json({ message: "Lỗi kiểm tra quyền" });
  }
};
