import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  code: [{ required: true, message: "条码类型名称为必填项", trigger: "blur" }],
  length: [{ required: true, message: "条码类型长度为必填项", trigger: "blur" }]
});
