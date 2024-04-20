import { defineStore } from "pinia";
import { store } from "@/store";
// import { EntityTypeEnum, Entity } from "./types";
// import type { Department, Role, Entity, Location, Category } from "./types";
import {
  RoleAPI,
  DepartmentAPI,
  EntityAPI,
  LocationAPI,
  CategoryAPI,
  AttributeAPI,
  ItemAPI
} from "@/api/system";
import { usePublicSharedFunctionsHooks } from "@/helpers/sharedFunctions";
import { handleTree } from "@/utils/tree";

const { formatHigherGeneralOptions, formatHigherLocationOptions } =
  usePublicSharedFunctionsHooks();

export const usePublicStore = defineStore({
  id: "public-store",
  state: () => ({
    publicRoles: [],
    publicDepartments: [],
    publicCompanies: [],
    publicEmployees: [],
    publicWorkers: [],
    publicLocations: [],
    publicCategories: [],
    publicAttributes: [],
    publicSuppliers: [],
    publicCustomer: [],

    publicItems: []
  }),
  getters: {
    // 获取所有模具item
    allMoldItems: state =>
      state.publicItems.filter(each => each?.etype === "Mold"),
    allProducibleItems: state =>
      state.publicItems.filter(
        each => each?.etype === "Product" && each.meta.canBeProduced
      ),

    getAttributeValuesByAttirbute: state => (attributeId: string) => {
      let rt = [];
      if (attributeId) {
        const t = state.publicAttributes.filter(
          each => each._id === attributeId
        );
        if (t && t.length === 1) {
          rt = t[0].values;
        }
      }
      return rt;
    },
    productionLocationOptionsTree:
      state => (disabledTypeList?: string[], enabledTypeList?: string[]) =>
        formatHigherLocationOptions(
          handleTree(state.publicLocations, "_id", "parent"),
          disabledTypeList,
          enabledTypeList
        ),
    locationOptionsTree: state =>
      formatHigherGeneralOptions(
        handleTree(state.publicLocations, "_id", "parent")
      ),
    departmentOptionsTree: state =>
      formatHigherGeneralOptions(
        handleTree(state.publicDepartments, "_id", "parent")
      ),
    categoryOptionsTree: state =>
      formatHigherGeneralOptions(
        handleTree(state.publicCategories, "_id", "parent")
      ),
    publicWorkers: state =>
      state.publicEmployees.filter(each => each?.meta?.isWorker),
    publicOfficers: state =>
      state.publicEmployees.filter(
        each => each?.employee?.etype in ["Fulltime"]
      )
  },
  actions: {
    SET(data: Array<any>, type: string) {
      switch (type) {
        case "Role":
          this.publicRoles = data;
          break;
        case "Location":
          this.publicLocations = data;
          break;
        case "Employee":
          this.publicEmployees = data;
          break;
        case "Company":
          this.publicCompanies = data;
          break;
        case "Department":
          this.publicDepartments = data;
          break;
        case "Category":
          this.publicCategories = data;
          break;
        case "Attribute":
          this.publicAttributes = data;
          break;
        case "Supplier":
          this.publicSuppliers = data;
          break;
        case "Customer":
          this.publicCustomers = data;
          break;
        case "Item":
          this.publicItems = data;
          break;
        default:
          console.log("not implement");
      }
    },

    /** 获取所有公开的部门 */
    async getAllPublicDepartments(refresh: boolean) {
      if (refresh || this.publicDepartments.length === 0) {
        const req = await DepartmentAPI.getAllPublic();
        this.SET(req.data, "Department");
      }
      return this.publicDepartments;
    },
    /** 获取所有公开的供应商 */
    async getAllPublicSuppliers(refresh: boolean) {
      if (refresh || this.publicSuppliers.length === 0) {
        const req = await EntityAPI.Supplier.getAllPublic();
        this.SET(req.data, "Supplier");
      }
      return this.publicSuppliers;
    },
    /** 获取所有公开的客户 */
    async getAllPublicCustomers(refresh: boolean) {
      if (refresh || this.publicCustomers.length === 0) {
        const req = await EntityAPI.Customer.getAllPublic();
        this.SET(req.data, "Customer");
      }
      return this.publicCustomers;
    },
    /** 获取所有公开的角色 */
    async getAllPublicRoles(refresh: boolean) {
      if (refresh || this.publicRoles.length === 0) {
        const req = await RoleAPI.getAllPublic();
        this.SET(req.data, "Role");
      }
      return this.publicRoles;
    },
    /** 获取所有公开的公司 */
    async getAllPublicCompanies(refresh: boolean) {
      if (refresh || this.publicCompanies.length === 0) {
        const req = await EntityAPI.Company.getAllPublic();
        this.SET(req.data, "Company");
      }
      return this.publicCompanies;
    },
    /** 获取所有公开的员工 */
    async getAllPublicEmployees(refresh: boolean) {
      if (refresh || this.publicEmployees.length === 0) {
        const req = await EntityAPI.Employee.getAllPublic();
        this.SET(req.data, "Employee");
      }
      return this.publicEmployees;
    },
    /** 获取所有公开的地点 */
    async getAllPublicLocations(refresh: boolean) {
      if (refresh || this.publicLocations.length === 0) {
        const req = await LocationAPI.getAllPublic();
        this.SET(req.data, "Location");
      }
      return this.publicLocations;
    },
    /** 获取所有公开的产品类别 */
    async getAllPublicCategories(refresh: boolean) {
      if (refresh || this.publicCategories.length === 0) {
        const req = await CategoryAPI.getAllPublic();
        this.SET(req.data, "Category");
      }
      return this.publicCategories;
    },
    /** 获取所有公开的产品属性 */
    async getAllPublicAttributes(refresh: boolean) {
      if (refresh || this.publicAttributes.length === 0) {
        const req = await AttributeAPI.getAllPublic();
        this.SET(req.data, "Attribute");
      }
      return this.publicAttributes;
    },
    /** 获取所有公开的产品 */
    async getAllPublicItems(refresh: boolean) {
      if (refresh || this.publicItems.length === 0) {
        const req = await ItemAPI.getAllPublic();
        this.SET(req.data, "Item");
      }
      return this.publicItems;
    }
  }
});

export function usePublicStoreHook() {
  return usePublicStore(store);
}
