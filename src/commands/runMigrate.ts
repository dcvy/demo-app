import dotenv from "dotenv";
import fs from "fs";
import mongoose from "mongoose";
import path from "path";
import { register } from "ts-node";

dotenv.config();

// Đăng ký ts-node để require được file .ts
register({
  transpileOnly: true,
  compilerOptions: {
    module: "NodeNext",
    moduleResolution: "NodeNext",
    allowJs: true,
    esModuleInterop: true,
  },
});
const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    const db = mongoose.connection.db!;
    const logCol = db.collection("migrations_log");

    const mode = process.argv[2] || "up";
    const migrationsDir = path.resolve(__dirname, "../../migrations");

    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".ts") || f.endsWith(".js"))
      .sort();

    if (mode === "up") {
      for (const file of files) {
        if (await logCol.findOne({ fileName: file })) continue;

        console.log(`🚀 Migrating UP: ${file}`);
        const filePath = path.join(migrationsDir, file);

        // DÙNG REQUIRE THAY CHO IMPORT ĐỂ TRÁNH LỖI EXTENSION TRÊN WINDOWS
        delete require.cache[require.resolve(filePath)]; // Clear cache nếu cần
        const migration = require(filePath);

        const upFn = migration.up || migration.default?.up;

        if (typeof upFn === "function") {
          await upFn(db);
          await logCol.insertOne({ fileName: file, appliedAt: new Date() });
          console.log(`✅ Thành công: ${file}`);
        } else {
          console.error(`❌ File ${file} không export hàm 'up'!`);
        }
      }
    } else if (mode === "down") {
      const lastApplied = await logCol
        .find()
        .sort({ appliedAt: -1 })
        .limit(1)
        .toArray();

      if (lastApplied.length === 0) {
        console.log("ℹ️ Không có migration nào để hoàn tác.");
      } else {
        const file = lastApplied[0]!.fileName;
        console.log(`🔻 Rollback: ${file}`);

        const filePath = path.join(migrationsDir, file);
        const migration = require(filePath);
        const downFn = migration.down || migration.default?.down;

        if (typeof downFn === "function") {
          await downFn(db);
          await logCol.deleteOne({ _id: lastApplied[0]!._id });
          console.log(`🗑️ Đã hoàn tác thành công: ${file}`);
        }
      }
    }

    console.log("✨ Hoàn tất!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Lỗi:", err);
    process.exit(1);
  }
};

run();
