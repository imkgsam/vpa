import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";
import type {
  Entity,
  UserAccount,
  Employee,
  Customer
} from "@/store/modules/types";

export type Result = {
  statusCode: boolean;
  data: Entity | UserAccount | Employee | Customer;
};

export type ArrayResult = {
  statusCode: boolean;
  data: Array<Entity | UserAccount | Employee | Customer>;
};

export type OperationResult = {
  statusCode: boolean;
  message: string;
};

// ----------------------------- Entity -----------------------------------

/** 获取所有entity */
export const getAllEntities = (data?: object) => {
  return http.request<ArrayResult>("get", baseUrlApi("entity/all"), { data });
};

/** 获取所有公司 */
export const getAllCompanies = (data?: object) => {
  return http.request<ArrayResult>("get", baseUrlApi("entity/company/all"), {
    data
  });
};

/** 获取所有个人 */
export const getAllPeople = (data?: object) => {
  return http.request<ArrayResult>("get", baseUrlApi("entity/person/all"), {
    data
  });
};

// ----------------------------- Employee ---------------------------------

/** 获取所有员工 */
export const getAllEmployees = (data?: object) => {
  return http.request<ArrayResult>("get", baseUrlApi("entity/employee/all"), {
    data
  });
};

// ----------------------------- Customer ---------------------------------
// ----------------------------- Supplier ---------------------------------
