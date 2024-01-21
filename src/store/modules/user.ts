import { defineStore } from "pinia";
import { store } from "@/store";
// import { EntityTypeEnum, Entity } from "./types";
import type { Account, User } from "./types";
import { routerArrays } from "@/layout/types";
import { router, resetRouter } from "@/router";
import { storageLocal } from "@pureadmin/utils";
import {
  changePasswordByEmail,
  refreshTokenApi,
  getLogout,
  requestDetailedAccountInfoByEntity,
  getLogin
} from "@/api/user";
import type {
  UserResult,
  RefreshTokenResult,
  OperationResult
} from "@/api/user";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { type DataInfo, setToken, removeToken, userKey } from "@/utils/auth";
// import { toRaw } from "vue";
import { merge } from "lodash";

export const useUserStore = defineStore({
  id: "pure-user",
  state: (): Account => ({
    user: {
      // 用户名
      accountName:
        storageLocal().getItem<DataInfo<number>>(userKey)?.user.accountName ??
        "",
      //邮箱
      email:
        storageLocal().getItem<DataInfo<number>>(userKey)?.user.email ?? "",
      // 页面级别权限
      roles: storageLocal().getItem<DataInfo<number>>(userKey)?.user.roles ?? []
    },
    entity: {
      _id: storageLocal().getItem<DataInfo<number>>(userKey)?.user.entity ?? "",
      name: "",
      etype: "Person",
      personal: {
        sex: "Others",
        jobTitle: "",
        birth: null
      },
      enterprise: {
        manager: null,
        foundedAt: null,
        taxNum: ""
      },
      common: {
        website: "",
        email: "",
        landline: "",
        mobilePhone: "",
        country: "",
        city: "",
        industry: "",
        internalNote: ""
      },
      socialMedias: [],
      meta: {
        enabled: false,
        verified: false
      }
    },
    employee: {
      _id: "",
      etype: "",
      departments: [],
      manager: null,
      workPhone: "",
      workMobile: "",
      workEmail: ""
    },
    supplier: {
      _id: null
    },
    customer: {
      _id: null
    },
    // 前端生成的验证码（按实际需求替换）
    verifyCode: "",
    // 判断登录页面显示哪个组件（0：登录（默认）、1：手机登录、2：二维码登录、3：注册、4：忘记密码）
    currentPage: 0,
    // 是否勾选了登录页的免登录
    isRemembered: false,
    // 登录页的免登录存储几天，默认7天
    loginDay: 7
  }),
  actions: {
    SET_USER(user: User) {
      this.user = user;
    },
    /** 存储entity ID */
    SET_ENTITYID(entityId: string) {
      this.entity._id = entityId;
    },
    /** 存储前端生成的验证码 */
    SET_VERIFYCODE(verifyCode: string) {
      this.verifyCode = verifyCode;
    },
    /** 存储登录页面显示哪个组件 */
    SET_CURRENTPAGE(value: number) {
      this.currentPage = value;
    },
    /** 存储是否勾选了登录页的免登录 */
    SET_ISREMEMBERED(bool: boolean) {
      this.isRemembered = bool;
    },
    /** 设置登录页的免登录存储几天 */
    SET_LOGINDAY(value: number) {
      this.loginDay = Number(value);
    },
    /** 登入 */
    async loginByEmail(data) {
      return new Promise<UserResult>((resolve, reject) => {
        getLogin(data)
          .then(data => {
            if (data) {
              setToken(data.data);
              resolve(data);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /** 获取基本entity信息 */
    async requestEntity() {
      if (!this.entity.name && this.entity._id) {
        console.log("requesting remote");
        const entityInfo = await requestDetailedAccountInfoByEntity();
        merge(this.entity, entityInfo.data);
        merge(this.employee, entityInfo.data.employee);
      } else {
        console.log("requesting local ");
      }
    },
    /** 修改密码 */
    async changePasswordByEmail(data) {
      return new Promise<OperationResult>((resolve, reject) => {
        changePasswordByEmail(data)
          .then(data => {
            if (data) {
              resolve(data);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /** 前端登出*/
    async logOut() {
      try {
        /** 后端登出 */
        await getLogout();
      } catch (err) {
      } finally {
        removeToken();
        useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
        resetRouter();
        this.$reset();
        router.push("/login");
      }
    },
    /** 刷新`token` */
    async handRefreshToken(data) {
      return new Promise<RefreshTokenResult>((resolve, reject) => {
        refreshTokenApi(data)
          .then(data => {
            if (data) {
              setToken(data.data);
              resolve(data);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
