import bcrypt from "bcryptjs";
import { Db } from "mongodb";

export const up = async (db: Db) => {
  console.log(">>> Bắt đầu Migration: Seeding Auth & Phân quyền...");

  const hashedPassword = await bcrypt.hash("123456", 10);
  const now = new Date();

  // 1. Xử lý User Groups (Upsert để tránh trùng lặp)
  const groupsData = [
    { name: "admin_full", description: "Toàn quyền hệ thống" },
    { name: "user_standard", description: "Khách hàng mua sắm" },
    { name: "shop_owner", description: "Chủ cửa hàng quản lý đơn và hàng" },
  ];

  const groupIds: any = {};
  for (const g of groupsData) {
    await db.collection("usergroups").updateOne(
      { name: g.name },
      {
        $set: { description: g.description, updatedAt: now },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true }
    );
    const groupDoc = await db
      .collection("usergroups")
      .findOne({ name: g.name });
    groupIds[g.name] = groupDoc?._id;
  }

  // 2. Xử lý Users
  const usersData = [
    {
      username: "admin_root",
      fullName: "System Admin",
      email: "admin@example.com",
      group: "admin_full",
    },
    {
      username: "user_customer",
      fullName: "Khách",
      email: "customer@example.com",
      group: "user_standard",
    },
    {
      username: "shop_manager",
      fullName: "Chủ Shop",
      email: "owner@example.com",
      group: "shop_owner",
    },
  ];

  for (const u of usersData) {
    await db.collection("users").updateOne(
      { username: u.username },
      {
        $set: {
          fullName: u.fullName,
          email: u.email,
          password: hashedPassword,
          userGroup: [groupIds[u.group]],
          updatedAt: now,
        },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true }
    );
  }

  // 3. Xóa dữ liệu cũ trong casbin_rules để tránh rác (Dựa trên ID và Username)
  const groupIdsArr = Object.values(groupIds).map((id: any) => id.toString());
  await db.collection("casbin_rules").deleteMany({
    v0: {
      $in: [...groupIdsArr, "admin_root", "user_customer", "shop_manager"],
    },
  });

  // 4. Định nghĩa Policies (p) - Dùng ID của Group làm v0
  const policies = [
    // --- ADMIN FULL ---
    { ptype: "p", v0: groupIds["admin_full"].toString(), v1: "/*", v2: "*" },

    // --- USER STANDARD (Khách hàng) ---
    {
      ptype: "p",
      v0: groupIds["user_standard"].toString(),
      v1: "/orders",
      v2: "POST",
    },
    {
      ptype: "p",
      v0: groupIds["user_standard"].toString(),
      v1: "/orders/my-orders",
      v2: "GET",
    },
    {
      ptype: "p",
      v0: groupIds["user_standard"].toString(),
      v1: "/orders/*",
      v2: "GET",
    },
    {
      ptype: "p",
      v0: groupIds["user_standard"].toString(),
      v1: "/orders/*",
      v2: "PUT",
    },
    {
      ptype: "p",
      v0: groupIds["user_standard"].toString(),
      v1: "/orders/*",
      v2: "DELETE",
    },
    {
      ptype: "p",
      v0: groupIds["user_standard"].toString(),
      v1: "/orders/payment/zalopay/*",
      v2: "POST",
    },
    {
      ptype: "p",
      v0: groupIds["user_standard"].toString(),
      v1: "/activities*",
      v2: "*",
    },
    {
      ptype: "p",
      v0: groupIds["user_standard"].toString(),
      v1: "/clothes*",
      v2: "GET",
    },
    {
      ptype: "p",
      v0: groupIds["user_standard"].toString(),
      v1: "/categories*",
      v2: "GET",
    },

    // --- SHOP OWNER (Chủ Shop) ---
    {
      ptype: "p",
      v0: groupIds["shop_owner"].toString(),
      v1: "/orders",
      v2: "GET",
    },
    {
      ptype: "p",
      v0: groupIds["shop_owner"].toString(),
      v1: "/orders/*",
      v2: "GET",
    },
    {
      ptype: "p",
      v0: groupIds["shop_owner"].toString(),
      v1: "/orders/status/*",
      v2: "PATCH",
    },
    {
      ptype: "p",
      v0: groupIds["shop_owner"].toString(),
      v1: "/orders/refund/*",
      v2: "POST",
    },
    {
      ptype: "p",
      v0: groupIds["shop_owner"].toString(),
      v1: "/activities*",
      v2: "*",
    },
    {
      ptype: "p",
      v0: groupIds["shop_owner"].toString(),
      v1: "/categories*",
      v2: "*",
    },
    {
      ptype: "p",
      v0: groupIds["shop_owner"].toString(),
      v1: "/clothes*",
      v2: "*",
    },
  ];

  // 5. Định nghĩa Groupings (g) - Map Username vào ID Group
  const groupings = [
    { ptype: "g", v0: "admin_root", v1: groupIds["admin_full"].toString() },
    {
      ptype: "g",
      v0: "user_customer",
      v1: groupIds["user_standard"].toString(),
    },
    { ptype: "g", v0: "shop_manager", v1: groupIds["shop_owner"].toString() },
  ];

  await db.collection("casbin_rules").insertMany([...policies, ...groupings]);
  console.log("✅ Seeding hoàn tất với đầy đủ phân quyền!");
};

export const down = async (db: Db) => {
  console.log(">>> Đang dọn dẹp dữ liệu Auth mẫu...");

  await db.collection("users").deleteMany({
    username: { $in: ["admin_root", "user_customer", "shop_manager"] },
  });
  await db.collection("usergroups").deleteMany({
    name: { $in: ["admin_full", "user_standard", "shop_owner"] },
  });

  // Xóa Casbin rules (Xóa theo v0 là username hoặc ID group)
  // Lưu ý: Regex giúp tìm các rule chứa ID group trong database casbin
  await db.collection("casbin_rules").deleteMany({});

  console.log("✅ Đã dọn dẹp sạch dữ liệu mẫu.");
};
