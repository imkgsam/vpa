import { http } from "@/utils/http";
import type {
  Department,
  Role,
  Attribute,
  Category
} from "@/store/modules/types";
import { baseUrlApi } from "./utils";

type Result = {
  success: boolean;
  data?: object;
};

type ListResult<T> = {
  statusCode: string;
  message: string;
  data: Array<T>;
};

type OneResult<T> = {
  statusCode: string;
  message: string;
  data: T;
};

type ListResultWithPage<T> = {
  statusCode: string;
  message: string;
  data?: {
    /** 列表数据 */
    list: Array<T>;
    /** 总条目数 */
    total?: number;
    /** 每页显示条目个数 */
    pageSize?: number;
    /** 当前页数 */
    currentPage?: number;
  };
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

/** 获取系统管理-用户管理列表 */
export const getUserList = (data?: object) => {
  return http.request<ResultTable>("post", "/user", { data });
};

/** 系统管理-用户管理-获取所有角色列表 */
export const getAllRoleList = () => {
  return http.request<Result>("get", "/list-all-role");
};

/** 系统管理-用户管理-根据userId，获取对应角色id列表（userId：用户id） */
export const getRoleIds = (data?: object) => {
  return http.request<Result>("post", "/list-role-ids", { data });
};

/** 获取系统管理-角色管理列表 */
export const getRoleListWithFilters = (data?: object) => {
  return http.request<ResultTable>("post", "/role", { data });
};

/** 获取系统管理-菜单管理列表 */
export const getMenuList = (data?: object) => {
  return http.request<Result>("post", "/menu", { data });
};

/** 获取系统管理-部门管理列表 */
export const getDeptList = (data?: object) => {
  return http.request<Result>("post", "/dept", { data });
};

/** 获取系统监控-在线用户列表 */
export const getOnlineLogsList = (data?: object) => {
  return http.request<ResultTable>("post", "/online-logs", { data });
};

/** 获取系统监控-登录日志列表 */
export const getLoginLogsList = (data?: object) => {
  return http.request<ResultTable>("post", "/login-logs", { data });
};

/** 获取系统监控-操作日志列表 */
export const getOperationLogsList = (data?: object) => {
  return http.request<ResultTable>("post", "/operation-logs", { data });
};

/** 获取系统监控-系统日志列表 */
export const getSystemLogsList = (data?: object) => {
  return http.request<ResultTable>("post", "/system-logs", { data });
};

// --------------------------------- api ---------------------------------------------------

export const DepartmentAPI = {
  getList: (data?: object) => {
    return http.request<ListResult<Department>>(
      "get",
      baseUrlApi("department/all"),
      { data }
    );
  },
  create: (data?: object) => {
    return http.request<OneResult<Department>>(
      "post",
      baseUrlApi("department/"),
      { data }
    );
  },
  update: (data?: object) => {
    return http.request<OneResult<Department>>(
      "put",
      baseUrlApi("department/"),
      { data }
    );
  },
  toggleStatus: (data: object, newValue: boolean) => {
    if (newValue) {
      return http.request<OneResult<Department>>(
        "post",
        baseUrlApi("department/enable"),
        {
          data
        }
      );
    } else {
      return http.request<OneResult<Department>>(
        "post",
        baseUrlApi("department/disable"),
        {
          data
        }
      );
    }
  },
  delete: (data: object) => {
    return http.request<OneResult<Department>>(
      "post",
      baseUrlApi("department/delete"),
      {
        data
      }
    );
  }
};

export const RoleAPI = {
  getListWithFilter: (data?: object) => {
    return http.request<ListResultWithPage<Role>>(
      "post",
      baseUrlApi("roles/filters"),
      {
        data
      }
    );
  }
};

export const CategoryAPI = {
  getList: (data?: object) => {
    return http.request<ListResult<Category>>(
      "get",
      baseUrlApi("item/category/all"),
      {
        data
      }
    );
  },
  create: (data?: object) => {
    return http.request<OneResult<Category>>(
      "post",
      baseUrlApi("item/category/"),
      { data }
    );
  },
  update: (data?: object) => {
    return http.request<OneResult<Category>>(
      "put",
      baseUrlApi("item/category/"),
      { data }
    );
  },
  delete: (data: object) => {
    return http.request<OneResult<Category>>(
      "post",
      baseUrlApi("item/category/delete"),
      {
        data
      }
    );
  }
};

export const AttributeAPI = {
  getListWithFilter: (data?: object) => {
    return http.request<ListResultWithPage<Attribute>>(
      "post",
      baseUrlApi("item/attribute/filters"),
      { data }
    );
  },
  create: (data?: object) => {
    return http.request<OneResult<Attribute>>(
      "post",
      baseUrlApi("item/attribute/"),
      {
        data
      }
    );
  },
  detail: (id: string) => {
    return http.request<OneResult<Attribute>>(
      "get",
      baseUrlApi("item/attribute/detail"),
      {
        params: { id }
      }
    );
  },
  update: (data?: object) => {
    return http.request<OneResult<Attribute>>(
      "put",
      baseUrlApi("item/attribute/"),
      { data }
    );
  },
  delete: (data: object) => {
    return http.request<OneResult<Attribute>>(
      "post",
      baseUrlApi("item/attribute/delete"),
      {
        data
      }
    );
  },
  toggleStatus: (data: object, newValue: boolean) => {
    if (newValue) {
      return http.request<OneResult<Attribute>>(
        "post",
        baseUrlApi("item/attribute/enable"),
        {
          data
        }
      );
    } else {
      return http.request<OneResult<Attribute>>(
        "post",
        baseUrlApi("item/attribute/disable"),
        {
          data
        }
      );
    }
  }
};
