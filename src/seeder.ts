import bcrypt from "bcryptjs";
import { User } from "./modules/users/user.collection";
import { UserGroup } from "./modules/userGroups/userGroup.collection";
import { getEnforcer } from "./casbin";
import * as dotenv from "dotenv";

dotenv.config();

export const seedAuthData = async () => {
  try {
    console.log("--- Bắt đầu Seeding dữ liệu Auth (n-n) ---");

    const adminUsername = "admin_root";

    const existedAdmin = await User.findOne({ username: adminUsername });
    if (existedAdmin) {
      console.log("ℹ️ Admin đã tồn tại → bỏ qua seeding");
      return;
    }

    let adminFullGroup = await UserGroup.findOneAndUpdate(
      { name: "admin_full" },
      { description: "Nhóm có toàn quyền hệ thống" },
      { upsert: true, new: true }
    );

    let adminReadGroup = await UserGroup.findOneAndUpdate(
      { name: "admin_readonly" },
      { description: "Nhóm chỉ có quyền xem dữ liệu" },
      { upsert: true, new: true }
    );

    console.log("✅ Đã chuẩn bị các UserGroup (ObjectId)");

    const hashedPassword = await bcrypt.hash("admin123456", 10);
    const newAdmin = await User.create({
      username: adminUsername,
      fullName: "System Admin Multi-Role",
      email: "admin@example.com",
      password: hashedPassword,
      userGroup: [adminFullGroup._id, adminReadGroup._id],
    });

    console.log(`✅ Đã tạo admin_root với 2 nhóm quyền.`);

    const enforcer = await getEnforcer();

    const fullPolicies: [string, string, string][] = [
      [adminFullGroup._id.toString(), "/users*", "*"],
      [adminFullGroup._id.toString(), "/user-groups*", "*"],
      [adminFullGroup._id.toString(), "/permissions*", "*"],
    ];

    const readPolicies: [string, string, string][] = [
      [adminReadGroup._id.toString(), "/users*", "GET"],
    ];

    const allPolicies = [...fullPolicies, ...readPolicies];
    for (const [sub, obj, act] of allPolicies) {
      const exists = await enforcer.hasPolicy(sub, obj, act);
      if (!exists) {
        await enforcer.addPolicy(sub, obj, act);
      }
    }

    const rolesToAssign = [
      adminFullGroup._id.toString(),
      adminReadGroup._id.toString(),
    ];

    for (const roleId of rolesToAssign) {
      const hasGroup = await enforcer.hasGroupingPolicy(adminUsername, roleId);
      if (!hasGroup) {
        await enforcer.addGroupingPolicy(adminUsername, roleId);
      }
    }

    await enforcer.savePolicy();

    console.log("--- Seeding Auth (Multi-Role) hoàn tất ---");
    console.log(
      "💡 Giải thích: admin_root thuộc 2 nhóm. Casbin sẽ ưu tiên quyền cao nhất (*)."
    );
    console.log("seed thành công");
  } catch (error) {
    console.error("❌ Lỗi Seeding:", error);
  }
};
