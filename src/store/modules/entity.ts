import { defineStore } from "pinia";
import { store } from "@/store";
// import { EntityTypeEnum, Entity } from "./types";
import type { Department } from "./types";
import { getAllEmployees } from "@/api/entity";

export const useEntityStore = defineStore({
  id: "pure-employee",
  state: () => ({
    employees: []
  }),
  actions: {
    SET_EMPLOYEES(employees: Array<Department>) {
      this.employees = employees;
    },

    /** 获取所有员工 */
    async getAllEmployees(refresh: boolean) {
      if (refresh || this.employees.length === 0) {
        console.log("requesting remote");
        const req = await getAllEmployees();
        console.log(req.data);
        this.SET_EMPLOYEES(req.data);
      } else {
        console.log("requesting local store");
      }
      return this.employees;
    }
  }
});

export function useEntityStoreHook() {
  return useEntityStore(store);
}
