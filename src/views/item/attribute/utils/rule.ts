import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  name: [{ required: true, message: "属性名称为必填项", trigger: "blur" }],
  code: [{ required: true, message: "属性代码为必填项", trigger: "blur" }]
});

export const form2Rules = reactive(<FormRules>{
  name: [{ required: true, message: "属性值名称为必填项", trigger: "blur" }],
  code: [{ required: true, message: "属性值代码为必填项", trigger: "blur" }],
  abbr: [{ required: true, message: "属性值缩写为必填项", trigger: "blur" }]
});
