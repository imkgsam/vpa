import { defineStore } from "pinia";
import { store } from "@/store";
// import { EntityTypeEnum, Entity } from "./types";
import type { Department, Role } from "./types";
import { getAllEmployees } from "@/api/entity";
import { RoleAPI } from "@/api/system";

export const useEntityStore = defineStore({
  id: "pure-employee",
  state: () => ({
    employees: [],
    roles: []
  }),
  actions: {
    SET_EMPLOYEES(employees: Array<Department>) {
      this.employees = employees;
    },
    SET_ROLES(roles: Array<Role>) {
      this.roles = roles;
    },

    /** 获取所有员工 */
    async getAllEmployees(refresh: boolean) {
      if (refresh || this.employees.length === 0) {
        const req = await getAllEmployees();
        this.SET_EMPLOYEES(req.data);
      }
      return this.employees;
    },
    async getAllRoles_public(refresh: boolean) {
      if (refresh || this.roles.length === 0) {
        const req = await RoleAPI.getAllPublic();
        this.SET_ROLES(req.data);
      }
      return this.roles;
    }
  }
});

export function useEntityStoreHook() {
  return useEntityStore(store);
}
