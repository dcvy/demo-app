import fs from "fs";
import path from "path";

const args = process.argv.slice(2);
const name = args[0] || "migration";
const timestamp = new Date().toISOString().replace(/[-:T]/g, "").split(".")[0];
const fileName = `${timestamp}-${name}.ts`;
const migrationsDir = path.resolve(__dirname, "../../migrations");

if (!fs.existsSync(migrationsDir))
  fs.mkdirSync(migrationsDir, { recursive: true });

const template = `import { Db } from 'mongodb';

export const up = async (db: Db) => {
  console.log('🚀 Up: ${name}');
};

export const down = async (db: Db) => {
  console.log('⏪ Down: ${name}');
};
`;

fs.writeFileSync(path.join(migrationsDir, fileName), template);
console.log(`✅ Đã tạo: migrations/${fileName}`);
