import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";
import type { Entity, User } from "@/store/modules/types";

export type UserResult = {
  statusCode: boolean;
  data: {
    user: User;
    entity: string;
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

export type EntityResult = {
  statusCode: boolean;
  data: Entity;
};

export type OperationResult = {
  statusCode: boolean;
  message: string;
};

export type RefreshTokenResult = {
  statusCode: boolean;
  data: {
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

/** 登录 */
export const getLogin = (data?: object) => {
  return http.request<UserResult>("post", baseUrlApi("user/login/email"), {
    data
  });
};

/** 登出 */
export const getLogout = () => {
  return http.request("delete", baseUrlApi("user/logout"));
};

/** 刷新token */
export const refreshTokenApi = (data?: object) => {
  console.log("in refreshTokenApi");
  return http.request<RefreshTokenResult>("post", baseUrlApi("token/refresh"), {
    data
  });
};

/**获取entity讯息 */
export const requestDetailedAccountInfoByEntity = () => {
  return http.request<EntityResult>(
    "get",
    baseUrlApi("entity/detailedinfo4currentuser")
  );
};

/** 修改密码 */
export const changePasswordByEmail = (data?: object) => {
  return http.request<OperationResult>(
    "post",
    baseUrlApi("user/password/change"),
    { data }
  );
};
