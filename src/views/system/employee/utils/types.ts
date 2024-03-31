interface FormItemProps {
  _id: string;
  //主体名称 唯一 必填
  name: string;
  //别称 用于公司内部识别 唯一 可选
  alias?: string;
  //种类，个人还是公司
  etype: string;
  //对于个人是所属的公司，对于公司就是所属的母公司，可选
  scompany?: string;
  personal?: {
    //职位
    jobTitle?: string;
    //性别
    sex?: string;
    //生日
    birth?: Date;
  };
  enterprise?: {
    //公司
    manager?: string;
    //成立行业
    foundedAt?: Date;
    // 公司税务代码 用于识别公司机构 唯一
    taxNum?: string;
  };
  common?: {
    website?: string;
    //邮箱地址，个人-个人邮箱，公司-默认邮箱
    email?: string;
    //固话
    landline?: string;
    //手机
    mobilePhone?: string;
    //所在国家
    country?: string;
    //所在城市
    city?: string;
    //行业
    industry?: string;
    //内部备注
    internalNote?: string;
  };
  //所有社交方式
  socialMedias?: [];
  meta: {
    //是否开启
    enabled?: boolean;
    //是否已通过认证
    verified?: boolean;
    //是否为我司供应商
    isSupplier?: boolean;
    //是否为我司客户
    isCustomer?: boolean;
    //是否为我司员工
    isEmployee?: boolean;
    isUser?: boolean;
  };
  createdAt?: Date;
  updatedAt?: Date;
  account: {
    _id: string;
    accountName?: string;
    //用于登录，或接收邮件验证码
    email: string;
    //可用于接收短信验证码
    phone?: string;
    password: string;
    roles: string[];
    meta: {
      verified?: boolean;
      enabled?: boolean;
    };
    security: {
      questions?: {
        one: string;
        two: string;
        three: string;
      };
      bindedPhone?: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
  };
  employee: {
    _id: string;
    //关联主体 唯一 必填
    entity: string;
    //种类，
    etype: string;
    //部门s,可隶属多个部门
    departments?: string[];
    //直系管理员，
    manager?: string;
    //工作座机
    workPhone?: string;
    //工作手机
    workMobile?: string;
    //工作邮箱
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
      startDate?: Date;
      //计划试用时间 按天算
      period?: number;
      //试用期实际结束日期：提前转正，延期试用
      actualEndDate?: Date;
      //试用期结果
      result?: string;
      //试用期结果备注
      note?: string;
    };
    //个人隐私
    privacy?: {
      //家庭情况
      family?: {
        //婚姻情况
        status?: string;
        //需抚养子女数量
        dependentChildrenCount?: number;
      };
      //国籍
      nationality?: {
        //出生国家
        country?: string;
        //出生城市
        city?: string;
        //出生日期
        birth?: Date;
        //身份证
        ID?: string;
        //护照
        passport?: string;
        //税号
        taxNo?: string;
        //驾照号
        driverLicense?: string;
      };
      //紧急联系
      emergency?: {
        //联系人
        contact?: string;
        //联系电话
        phone?: string;
      };
    };
    //教育
    education?: {
      //最高学历
      qulification?: string;
      //毕业院校
      school?: string;
      //毕业日期
      graduatedAt?: Date;
      //专业
      major?: string;
    };
    meta: {
      //是否有效，当试用期结束时，1.如果通过则开启，如果不通过则关闭
      enabled: boolean;
    };
    createdAt?: Date;
    updatedAt?: Date;
  };
}
interface FormProps {
  formInline: FormItemProps;
}

interface RoleFormItemProps {
  accountName: string;
  nickname: string;
  /** 角色列表 */
  roleOptions: any[];
  /** 选中的角色列表 */
  ids: Record<number, unknown>[];
}
interface RoleFormProps {
  formInline: RoleFormItemProps;
}

export type { FormItemProps, FormProps, RoleFormItemProps, RoleFormProps };
