import { Enforcer, newEnforcer } from "casbin";
import { MongoAdapter } from "casbin-mongodb-adapter";
import path from "path";

class Casbin {
  static instance: Casbin;
  adapter: any;
  private _realEnforcer!: Enforcer;
  private _readyResolve!: () => void;
  private _readyReject!: (err: any) => void;
  private _readyPromise: Promise<void>;
  public enforcer: Enforcer; // đây là proxy

  private constructor() {
    this._readyPromise = new Promise((resolve, reject) => {
      this._readyResolve = resolve;
      this._readyReject = reject;
    });
    this.enforcer = this._createEnforcerProxy();
    this.init(); // không await, chạy background
  }

  private _createEnforcerProxy(): Enforcer {
    const self = this;
    return new Proxy({} as Enforcer, {
      get(_, prop: keyof Enforcer) {
        return async (...args: any[]) => {
          await self._readyPromise;
          const fn = (self._realEnforcer as any)[prop];
          if (typeof fn !== "function") {
            throw new Error(
              `Enforcer property '${String(prop)}' is not a function`
            );
          }
          return fn.apply(self._realEnforcer, args);
        };
      },
    });
  }

  private async init(): Promise<void> {
    const modelPath = path.join(process.cwd(), "src", "model.conf");
    const mongoUri = process.env.MONGO_URI || "";
    console.log("🚀 ~ Casbin init ~ mongoUri:", mongoUri);

    let retries = 0;
    const maxRetries = 10;

    const tryInit = async (): Promise<void> => {
      try {
        console.log(`Casbin initializing... attempt ${retries + 1}`);
        this.adapter = await MongoAdapter.newAdapter({
          uri: mongoUri,
          database: "user",
          collection: "casbin_rules",
        });
        this._realEnforcer = await newEnforcer(modelPath, this.adapter);
        await this._realEnforcer.loadPolicy();
        console.log("✅ Casbin đã kết nối MongoDB thành công");
        this._readyResolve();
      } catch (err) {
        console.error("Casbin init failed:", err);
        if (++retries < maxRetries) {
          console.log("Retrying in 5s...");
          await new Promise((r) => setTimeout(r, 5000));
          return tryInit();
        } else {
          this._readyReject(err);
          throw new Error("Casbin init failed after max retries");
        }
      }
    };

    await tryInit();
  }

  static getInstance() {
    if (!Casbin.instance) {
      Casbin.instance = new Casbin();
    }
    return Casbin.instance;
  }
}

export default Casbin.getInstance();
