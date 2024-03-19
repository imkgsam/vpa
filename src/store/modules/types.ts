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
  color?: string;
  company?: Entity;
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

  //员工编号-(唯一识别号, [年]-[h3/1]-[月]-[h3/2]-[日]-[h3/3]-[性别] md5-hash后三位975 陈双鹏2024年01月01日入职男 2490170151 )
  EID?: string;
  //ETL 员工职称等级(K为管理体系，P为普通员工体系 K1-9 P1-9 如有细分则为 K1.1 K3.2 P7.4 ...)
  ETL?: string;
  //入职日期 = 试用期起始日期 = 进入公司的日期
  inauguratiionDate?: Date;
  //试用期
  probation?: {
    //试用期开始时间
    startDate?: boolean;
    //计划试用时间 按天算
    period?: number;
    //试用期实际结束日期：提前转正，延期试用
    actualEndDate?: Date;
    //试用期结果
    result?: string;
    //试用期结果备注
    note?: string;
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
      taxNo?: string;
      driverLicense?: string;
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
    major?: string;
  };
};

export type User = {
  accountName: string;
  email: string;
  roles: string[];
  entity?: string;
};

export type Supplier = {
  _id: string;
};

export type Customer = {
  _id: string;
};

export type Account = {
  user: User;
  entity: Entity;
  employee?: Employee;
  customer?: Customer;
  supplier?: Supplier;
  verifyCode?: string;
  currentPage?: number;
  isRemembered?: boolean;
  loginDay?: number;
};

export type Attribute = {
  _id: string;
  name: string;
  code?: string;
  values?: Array<AttributeValue>;
};

export type AttributeValue = {
  _id: string;
  name: string;
  code: string;
  abbr: string;
  attribute: string;
};

export type Category = {
  _id: string;
  name: string;
  code: string;
  abbr: string;
  attribute: string;
};

export type Route = {
  _id?: string;
  path: string;
  name?: string;
  component?: string;
  redirect?: string;
  meta?: {
    title: string;
    icon?: string;
    extraIcon?: string;
    showLink?: boolean;
    showParent?: boolean;
    roles?: Array<string>;
    auths?: Array<string>;
    keepAlive?: boolean;
    frameSrc?: string;
    frameLoading?: boolean;
    transition?: {
      name?: string;
      enterTransition?: string;
      leaveTransition?: string;
    };
    hiddenTag?: boolean;
    dynamicLevel?: number;
    activePath?: string;
    rank?: number;
    enabled: boolean;
  };
  parent?: Route;
  createdAt?: Date;
  updatedAt?: Date;
};
