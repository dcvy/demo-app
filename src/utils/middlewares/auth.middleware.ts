import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import casbinInstance from "../../casbin";
import { User } from "../../modules/users/user.collection";
import { httpResponse } from "../../utils/httpResponse.core";

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
    return httpResponse.unauthorized(res, "Bạn cần đăng nhập để truy cập!");
  }

  try {
    const secret = process.env.JWT_SECRET || "secret";
    const decoded = jwt.verify(token, secret) as any;

    const user = await User.findOne({ username: decoded.username }).select(
      "-password"
    );

    if (!user) {
      return httpResponse.unauthorized(
        res,
        "Người dùng không tồn tại hoặc token không hợp lệ!"
      );
    }

    (req as any).user = {
      _id: user._id.toString(),
      username: user.username,
      userGroup: user.userGroup,
    };

    next();
  } catch (error) {
    console.error("Verify token error:", error);
    return httpResponse.forbidden(res, "Token không hợp lệ hoặc đã hết hạn!");
  }
};

export const checkPermission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user;

  if (!user) {
    return httpResponse.unauthorized(res, "Unauthorized");
  }

  try {
    const enforcer = casbinInstance.enforcer;

    const sub = user.username;
    // Sử dụng req.baseUrl + req.route.path để lấy path định danh (ví dụ: /api/users/:id)
    // thay vì path thực tế (/api/users/65a...) để khớp với policy trong Casbin
    const obj = req.baseUrl + (req.route?.path || req.path);
    const act = req.method.toUpperCase();

    // Tự động đồng bộ Grouping Policy nếu trong DB có mà Casbin chưa có
    if (user.userGroup && Array.isArray(user.userGroup)) {
      for (const groupId of user.userGroup) {
        const groupName = groupId.toString();
        const hasG = await enforcer.hasGroupingPolicy(sub, groupName);
        if (!hasG) {
          await enforcer.addGroupingPolicy(sub, groupName);
        }
      }
    }

    const allowed = await enforcer.enforce(sub, obj, act);

    if (process.env.NODE_ENV !== "production") {
      console.log(
        `[Casbin] Sub: ${sub} | Obj: ${obj} | Act: ${act} => ${
          allowed ? "ALLOWED" : "DENIED"
        }`
      );
    }

    if (allowed) {
      return next();
    }

    return httpResponse.forbidden(
      res,
      "Bạn không có quyền thực hiện hành động này"
    );
  } catch (error) {
    console.error("Casbin enforce error:", error);
    return httpResponse.serverError(res, "Lỗi kiểm tra quyền hạn");
  }
};
