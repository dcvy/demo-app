import bcrypt from "bcryptjs";
import casbin from "./casbin"; // ✅ default import
import { UserGroup } from "./modules/userGroups/userGroup.collection";
import { User } from "./modules/users/user.collection";

export const seedAuthData = async () => {
  try {
    console.log("--- Bắt đầu Seeding dữ liệu Auth ---");

    const adminUsername = "admin_root";

    const existedAdmin = await User.findOne({ username: adminUsername });
    if (existedAdmin) {
      console.log("ℹ️ Admin đã tồn tại → bỏ qua seeding");
      return;
    }

    const adminFullGroup = await UserGroup.findOneAndUpdate(
      { name: "admin_full" },
      { description: "Nhóm có toàn quyền hệ thống" },
      { upsert: true, new: true }
    );

    const adminReadGroup = await UserGroup.findOneAndUpdate(
      { name: "admin_readonly" },
      { description: "Nhóm chỉ có quyền xem dữ liệu" },
      { upsert: true, new: true }
    );

    const hashedPassword = await bcrypt.hash("admin123456", 10);

    await User.create({
      username: adminUsername,
      fullName: "System Admin Multi-Role",
      email: "admin@example.com",
      password: hashedPassword,
      userGroup: [adminFullGroup._id, adminReadGroup._id],
    });

    console.log("✅ Đã tạo admin_root với 2 nhóm quyền.");

    // ✅ DÙNG CASBIN PROXY — KHÔNG GỌI init
    const enforcer = casbin.enforcer;

    const fullPolicies: [string, string, string][] = [
      [adminFullGroup._id.toString(), "/users*", "*"],
      [adminFullGroup._id.toString(), "/user-groups*", "*"],
      [adminFullGroup._id.toString(), "/permissions*", "*"],
    ];

    const readPolicies: [string, string, string][] = [
      [adminReadGroup._id.toString(), "/users*", "GET"],
    ];

    for (const [sub, obj, act] of [...fullPolicies, ...readPolicies]) {
      if (!(await enforcer.hasPolicy(sub, obj, act))) {
        await enforcer.addPolicy(sub, obj, act);
      }
    }

    for (const roleId of [
      adminFullGroup._id.toString(),
      adminReadGroup._id.toString(),
    ]) {
      if (!(await enforcer.hasGroupingPolicy(adminUsername, roleId))) {
        await enforcer.addGroupingPolicy(adminUsername, roleId);
      }
    }

    await enforcer.savePolicy();

    console.log("✅ Seeding Auth hoàn tất");
  } catch (err) {
    console.error("❌ Lỗi Seeding:", err);
  }
};
