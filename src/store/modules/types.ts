import type { RouteRecordName } from "vue-router";

export type cacheType = {
  mode: string;
  name?: RouteRecordName;
};

export type positionType = {
  startIndex?: number;
  length?: number;
};

export type appType = {
  sidebar: {
    opened: boolean;
    withoutAnimation: boolean;
    // 判断是否手动点击Collapse
    isClickCollapse: boolean;
  };
  layout: string;
  device: string;
  sortSwap: boolean;
};

export type multiType = {
  path: string;
  name: string;
  meta: any;
  query?: object;
  params?: object;
};

export type setType = {
  title: string;
  fixedHeader: boolean;
  hiddenSideBar: boolean;
};

export enum EntityTypeEnum {
  COMPANY = "Company",
  PERSON = "Person"
}

export enum GenderTypeEnum {
  MALE = "Male",
  FEMALE = "Female",
  OTHERS = "Others"
}

export type KVMap = {
  mkey: string;
  mvalue: string;
};

export type Department = {
  name: string;
  manager?: string;
  parent?: Department;
  meta: {
    enabled: boolean;
  };
  createdAt?: Date;
  updatedAt?: Date;
};

export type Role = {
  _id: string;
  code: string;
};

export type Entity = {
  _id: string;
  name: string;
  alias?: string;
  etype: string;
  scompany?: Entity;
  personal?: {
    jobTitle?: string;
    sex?: string;
    birth?: Date;
  };
  enterprise?: {
    manager?: string;
    foundedAt?: Date;
    taxNum?: string;
  };
  common?: {
    website?: string;
    email?: string;
    landline?: string;
    mobilePhone?: string;
    country?: string;
    city?: string;
    industry?: string;
    internalNote?: string;
  };
  socialMedias?: KVMap[];
  employee?: Employee;
  meta?: {
    enabled?: boolean;
    verified?: boolean;
  };
};

export type Employee = {
  _id: string;
  etype: string;
  departments?: [];
  manager?: Entity;
  workPhone?: string;
  workMobile?: string;
  workEmail?: string;
  probation?: {
    isNeeded?: boolean;
    period?: number;
    startAt?: Date;
  };
  privacy?: {
    family?: {
      status?: string;
      dependentChildrenCount?: number;
    };
    nationality?: {
      country?: string;
      city?: string;
      birth?: Date;
      ID?: string;
      passport?: string;
    };
    emergency?: {
      contact?: string;
      phone?: string;
    };
  };
  education?: {
    qulification?: string;
    school?: string;
    graduatedAt?: Date;
  };
};

export type User = {
  accountName: string;
  email: string;
  roles: string[];
  entity?: string;
};

export type Account = {
  user: User;
  entity: Entity;
  employee?: Employee;
  verifyCode?: string;
  currentPage?: number;
  isRemembered?: boolean;
  loginDay?: number;
};
