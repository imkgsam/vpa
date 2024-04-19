export function usePublicAppVariableHooks() {
  /**
   * 员工类型
   */
  const employeeTypeOptions = [
    { en: "Fulltime", cn: "正式" },
    { en: "Intern", cn: "实习" },
    { en: "Temporary", cn: "临时" },
    { en: "Contract", cn: "合约" },
    { en: "Probationary", cn: "试用" },
    { en: "Outsource", cn: "外包" },
    { en: "Consultant", cn: "顾问" },
    { en: "Labor", cn: "工人" }
  ];
  /**
   * 试用结果类型
   */
  const probationResultTypeOptions = [
    { cn: "免试通过", en: "Pass Pass" },
    { cn: "到期通过", en: "Regular Pass" },
    { cn: "提前通过", en: "Ealier Pass" },
    { cn: "延期通过", en: "Delayed Pass" },
    { cn: "到期不通过", en: "Regular Fail" },
    { cn: "提前不通过", en: "Ealier Fail" },
    { cn: "延期不通过", en: "Delayed Fail" }
  ];
  /**
   * 学历类型
   */
  const EducationTypeOptions = [
    { cn: "小学教育", en: "Primary school education" },
    { cn: "初中教育", en: "Middle school education" },
    { cn: "高中教育", en: "High school education" },
    { cn: "中专", en: "Secondary vocational education" },
    { cn: "大专", en: "Higher vocational education" },
    { cn: "本科", en: "Undergraduate education" },
    { cn: "硕士", en: "Master" },
    { cn: "博士生", en: "Doctor" }
  ];
  /**
   * 婚姻状态
   */
  const MaritalStatusTypeOptions = [
    { cn: "单身", en: "Single" },
    { cn: "已婚", en: "Married" },
    { cn: "丧偶", en: "Widowed" },
    { cn: "离异", en: "Divorced" }
  ];

  /**
   * location 类型
   */
  const LocationTypeOptions = [
    { cn: "视图", en: "View" },
    { cn: "客户", en: "Customer" },
    { cn: "中转", en: "Transit" },
    { cn: "损耗", en: "Scrap" },
    { cn: "内部", en: "Internal" },
    { cn: "生产", en: "Production" },
    { cn: "退回", en: "Return" }
  ];

  /**
   * location 类型
   */
  const moldTypeOptions = [
    { cn: "高压成型", en: "HighPressure" },
    { cn: "上线成型", en: "On-line" },
    { cn: "地摊成型", en: "OnFloor" }
  ];

  /**
   * Item 类型
   */
  const ItemTypeOptions = [
    { cn: "物品", en: "Product" },
    { cn: "服务", en: "Service" },
    { cn: "模具", en: "Mold" }
  ];

  const MoldGroupStatusOptions = [
    // 闲置, 没有安装模具的时候
    "Idle",
    //待命中， 已经安装上了
    "Standby",
    // 维护中， 已经安装上，但是在维护中，不可生产
    "Maintenance",
    // 运行中， 正常生产中
    "Running",
    // 报废停用中， 已经不再生产的
    "Scrapped"
  ];

  return {
    employeeTypeOptions,
    probationResultTypeOptions,
    EducationTypeOptions,
    MaritalStatusTypeOptions,
    LocationTypeOptions,
    moldTypeOptions,
    ItemTypeOptions,
    MoldGroupStatusOptions
  };
}
