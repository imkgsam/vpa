import { defineStore } from "pinia";
import { store } from "@/store";
// import { EntityTypeEnum, Entity } from "./types";
import type { Department, Role, Entity } from "./types";
import { RoleAPI, DepartmentAPI, EntityAPI } from "@/api/system";
import { usePublicSharedFunctionsHooks } from "@/helpers/sharedFunctions";
import { handleTree } from "@/utils/tree";

const { formatHigherDeptOptions } = usePublicSharedFunctionsHooks();

export const usePublicStore = defineStore({
  id: "public-store",
  state: () => ({
    publicRoles: [],
    publicDepartments: [],
    publicCompanies: [],
    publicEmployees: [],
    publicWorkers: []
  }),
  getters: {
    departmentOptionsTree: state =>
      formatHigherDeptOptions(
        handleTree(state.publicDepartments, "_id", "parent")
      ),
    publicWorkers: state =>
      state.publicEmployees.filter(each => each.employees.etype === "Labor"),
    publicOfficers: state =>
      state.publicEmployees.filter(each => each.employees.etype in ["Fulltime"])
  },
  actions: {
    SET_PUBLIC_ROLES(data: Array<Role>) {
      this.publicRoles = data;
    },
    SET_PUBLIC_DEPARTMENTS(data: Array<Department>) {
      this.publicDepartments = data;
    },
    SET_PUBLIC_COMPANIES(data: Array<Entity>) {
      this.publicCompanies = data;
    },
    SET_PUBLIC_EMPLOYEES(data: Array<Entity>) {
      this.publicEmployees = data;
    },

    /** 获取所有公开的部门 */
    async getAllPublicDepartments(refresh: boolean) {
      if (refresh || this.publicDepartments.length === 0) {
        const req = await DepartmentAPI.getAllPublic();
        this.SET_PUBLIC_DEPARTMENTS(req.data);
      }
      return this.publicDepartments;
    },
    /** 获取所有公开的角色 */
    async getAllPublicRoles(refresh: boolean) {
      if (refresh || this.publicRoles.length === 0) {
        const req = await RoleAPI.getAllPublic();
        this.SET_PUBLIC_ROLES(req.data);
      }
      return this.publicRoles;
    },
    /** 获取所有公开的公司 */
    async getAllPublicCompanies(refresh: boolean) {
      if (refresh || this.publicCompanies.length === 0) {
        const req = await EntityAPI.Company.getAllPublic();
        this.SET_PUBLIC_COMPANIES(req.data);
      }
      return this.publicCompanies;
    },
    /** 获取所有公开的员工 */
    async getAllPublicEmployees(refresh: boolean) {
      if (refresh || this.publicEmployees.length === 0) {
        const req = await EntityAPI.Employee.getAllPublic();
        this.SET_PUBLIC_EMPLOYEES(req.data);
      }
      return this.publicEmployees;
    }
  }
});

export function usePublicStoreHook() {
  return usePublicStore(store);
}
