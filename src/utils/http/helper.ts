import { StatusCodeEnum } from "./types.d";

export function isSuccessRes(res) {
  console.log("in isSuccessRes");
  let rt = true;
  if (!res?.statusCode) {
    rt = false;
  } else if (!Object.values(StatusCodeEnum).includes(res.statusCode)) {
    rt = false;
  } else if (res.statusCode !== StatusCodeEnum.SUCCESS) {
    rt = false;
  }
  console.log("rt is ", rt);
  return rt;
}
