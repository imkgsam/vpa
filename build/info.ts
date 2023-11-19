import type { Plugin } from "vite";
import picocolors from "picocolors";
import dayjs, { Dayjs } from "dayjs";
import { getPackageSize } from "./utils";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

/** 编译初始信息 */
export function viteBuildInfo(): Plugin {
  let config: { command: string };
  let startTime: Dayjs;
  let endTime: Dayjs;
  let outDir: string;
  const { green, blue, bold } = picocolors;
  return {
    name: "vite:buildInfo",
    configResolved(resolvedConfig) {
      config = resolvedConfig;
      outDir = resolvedConfig.build?.outDir ?? "dist";
    },
    buildStart() {
      console.log(
        bold(green(`👏欢迎继续开发 ${blue("SET 4 [vue-pure-admin]")}`))
      );
      if (config.command === "build") {
        startTime = dayjs(new Date());
      }
    },
    closeBundle() {
      if (config.command === "build") {
        endTime = dayjs(new Date());
        getPackageSize({
          folder: outDir,
          callback: (size: string) => {
            console.log(
              bold(
                green(
                  `🎉恭喜打包完成（总用时${dayjs
                    .duration(endTime.diff(startTime))
                    .format("mm分ss秒")}，打包后的大小为${size}）`
                )
              )
            );
          }
        });
      }
    }
  };
}
