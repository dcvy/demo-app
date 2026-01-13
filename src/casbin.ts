import { newEnforcer, Enforcer } from "casbin";
import { MongoAdapter } from "casbin-mongodb-adapter";
import path from "path";
import * as dotenv from "dotenv";

dotenv.config();

let enforcer: Enforcer;

export const getEnforcer = async (): Promise<Enforcer> => {
  if (!enforcer) {
    const mongoUri = process.env.MONGO_URI || "";
    console.log("🚀 ~ getEnforcer ~ mongoUri:", mongoUri);
    const adapter = await MongoAdapter.newAdapter({
      uri: mongoUri,
      database: "user",
      collection: "casbin_rules",
    });

    const modelPath = path.join(process.cwd(), "src", "model.conf");
    enforcer = await newEnforcer(modelPath, adapter);

    await enforcer.loadPolicy();
    console.log("✅ Casbin đã kết nối MongoDB thành công");
  }
  return enforcer;
};
