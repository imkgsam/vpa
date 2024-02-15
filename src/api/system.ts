import { http } from "@/utils/http";
import type { Department } from "@/store/modules/types";
import { baseUrlApi } from "./utils";

type Result = {
  success: boolean;
  data?: Array<Department>;
};

type ResultTable = {
  success: boolean;
  data?: {
    /** 列表数据 */
    list: Array<any>;
    /** 总条目数 */
    total?: number;
    /** 每页显示条目个数 */
    pageSize?: number;
    /** 当前页数 */
    currentPage?: number;
  };
};

/** 获取用户管理列表 */
export const getUserList = (data?: object) => {
  return http.request<ResultTable>("post", "/user", { data });
};

/** 用户管理-获取所有角色列表 */
export const getAllRoleList = () => {
  return http.request<Result>("get", "/list-all-role");
};

/** 用户管理-根据userId，获取对应角色id列表（userId：用户id） */
export const getRoleIds = (data?: object) => {
  return http.request<Result>("post", "/list-role-ids", { data });
};

/** 获取角色管理列表 */
export const getRoleList = (data?: object) => {
  return http.request<ResultTable>("post", "/role", { data });
};

// ------------------------- 部门 ---------------------------

/** 获取部门管理列表 */
export const getDeptList = (data?: object) => {
  return http.request<Result>("post", "/dept", { data });
};

/** 获取部门管理列表 */
export const getDepartmentList = (data?: object) => {
  return http.request<Result>("get", baseUrlApi("department/all"), { data });
};

/** 创建新部门 */
export const createDepartment = (data?: object) => {
  console.log(data);
  return http.request<Result>("post", baseUrlApi("department/"), { data });
};

/** 修改部门信息 */
export const updateDepartment = (data?: object) => {
  return http.request<Result>("put", baseUrlApi("department/"), { data });
};

/** 修改 部门 状态 */
export const toggleDepartmentStatus = (data: object, newValue: boolean) => {
  if (newValue) {
    return http.request<Result>("post", baseUrlApi("department/enable"), {
      data
    });
  } else {
    return http.request<Result>("post", baseUrlApi("department/disable"), {
      data
    });
  }
};

/**  删除部门 */
export const deleteDepartment = (data: object) => {
  return http.request<Result>("post", baseUrlApi("department/delete"), {
    data
  });
};
