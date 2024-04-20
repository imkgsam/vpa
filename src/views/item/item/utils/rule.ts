import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  code: [{ required: true, message: "产品代码为必填项", trigger: "blur" }],
  category: [{ required: true, message: "产品类别为必填项", trigger: "blur" }],
  etype: [{ required: true, message: "产品种类为必填项", trigger: "blur" }],

  attributes: {
    attribute: [
      { required: true, message: "产品种类为必填项", trigger: "blur" }
    ],
    options2: [{ required: true, message: "产品种类为必填项", trigger: "blur" }]
  }
});

/** 自定义表单规则校验 */
export const detailFormRules = reactive(<FormRules>{
  code: [{ required: true, message: "产品代码为必填项", trigger: "blur" }],
  alias: [{ required: true, message: "内部别称为必填项", trigger: "blur" }],
  category: [{ required: true, message: "产品类别为必填项", trigger: "blur" }],
  etype: [{ required: true, message: "产品种类为必填项", trigger: "blur" }],

  attribute: [{ required: true, message: "属性为必填项", trigger: "blur" }],
  options2: [{ required: true, message: "属性选项为必填项", trigger: "blur" }]
});
