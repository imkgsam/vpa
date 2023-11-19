/** 处理环境变量 */
const warpperEnv = (envConf: Recordable): ViteEnv => {
  /** 此处为默认值 */
  const ret: ViteEnv = {
    VITE_PORT: 8848,
    VITE_PUBLIC_PATH: "",
    VITE_ROUTER_HISTORY: "",
    VITE_CDN: false,
    VITE_HIDE_HOME: "false",
    VITE_COMPRESSION: "none",
    //ace,11.18,adding x-api-key env var with default value
    VITE_X_API_KEY: "GCMUDiuY5a7WvyUNt9n3QztToSHzK7Uj"
  };

  for (const envName of Object.keys(envConf)) {
    let realValue = envConf[envName].replace(/\\n/g, "\n");
    realValue =
      realValue === "true" ? true : realValue === "false" ? false : realValue;

    if (envName === "VITE_PORT") {
      realValue = Number(realValue);
    }
    ret[envName] = realValue;
    if (typeof realValue === "string") {
      process.env[envName] = realValue;
    } else if (typeof realValue === "object") {
      process.env[envName] = JSON.stringify(realValue);
    }
  }
  return ret;
};

export { warpperEnv };
