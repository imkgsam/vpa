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
  viewportSize: { width: number; height: number };
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
  _id?: string;
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
  _id?: string;
  code?: string;
  title?: string;
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
  entity?: Entity;
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
  inaugurationDate?: Date;
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
    qualification?: string;
    school?: string;
    graduatedAt?: Date;
    major?: string;
  };
};

export type UserAccount = {
  _id?: string;
  accountName?: string;
  email?: string;
  roles?: string[];
  entity?: string;
};

export type Supplier = {
  _id: string;
};

export type Customer = {
  _id: string;
};

export type Account = {
  account: UserAccount;
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
  path?: string;
  name?: string;
  component?: string;
  redirect?: string;
  //将meta.title 翻译成中文
  title?: string;
  meta?: {
    title: string;
    icon?: string;
    extraIcon?: string;
    showLink?: boolean;
    showParent?: boolean;
    roles?: Array<string>;
    auths?: Array<string>;
    auths_options?: Array<string>;
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

export type RouteAuth = {
  _id?: string;
  name: string;
};

export type RouteAccess = {
  _id?: string;
  user?: UserAccount;
  role?: Role;
  route?: Route;
  auths: Array<RouteAuth>;
  meta?: {
    enabled: boolean;
  };
  createdAt?: Date;
  updatedAt?: Date;
};

export type BarcodeItem = {
  _id?: string;
  btype: BarcodeType;
  ttype: string;
  num: number;
  item: string;
  meta?: {
    enabled?: boolean;
  };
  createdAt?: Date;
  updatedAt?: Date;
};

export type BarcodeType = {
  _id?: string;
  code: string;
  startsWith?: string;
  remark?: string;
  length: number;
  meta?: {
    enabled?: boolean;
  };
  createdAt?: Date;
  updatedAt?: Date;
};

export type Location = {
  _id?: string;
  name: string;
  ltype: string;
  company?: Entity;
  parent?: Location;
  meta: {
    enabled: boolean;
  };
  createdAt?: Date;
  updatedAt?: Date;
};

export type MoldGroup = {
  _id?: string;
  name: string;
  workers: string[];
  department: Department;
  mtype: string;
  location: Location;
  manager: Entity;
  meta: {
    enabled: boolean;
  };
  createdAt?: Date;
  updatedAt?: Date;
};

export type MoldItem = {
  _id?: string;
  supplier: Entity;
  mold: Item;
  product: Item;
  moldGroup: MoldGroup;
  barcode: BarcodeItem;
  loadTime: Date;
  //报废日期
  scrapDate: Date;
  //理论最大注浆次数
  maxGroutingTimes: number;
  //初始注浆次数
  initialGroutingTimes: number;
  // 预警 阈值
  warningThreadhold: number;
  // 累计注浆次数，不含初始次数
  cumulativeGroutingTimes: number;
  meta: {
    enabled: boolean;
  };
  createdAt?: Date;
  updatedAt?: Date;
};

export type Item = {
  _id?: string;
  code: string;
  alias?: string;
  category: Category;
  etype: string;
  meta: {
    //是否启用
    enabled: boolean;
    //是否跟踪库存
    canBeStocked: boolean;
    //是否能销售
    canBeSold: boolean;
    //是否能采购
    canBePurchased: boolean;
    //是否能生产
    canBeProduced: boolean;
    //是否能出租
    canBeRented: boolean;
    // 是否有变体
    hasVariants: boolean;
    //是哪个款式的变体 parent
    isVariantOf?: Item;
    attributeTags?: Array<AttributeValue>;
  };
  attributes?: Array<AttributeOptions>;
  mold?: {
    maxGroutingTimes?: number;
    warningThreadhold?: number;
    product?: Item;
    mtype?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
};

export type AttributeOptions = {
  attribute: Attribute;
  options: Array<AttributeValue>;
};
