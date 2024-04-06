import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  code: [{ required: true, message: "产品代码为必填项", trigger: "blur" }],
  category: [{ required: true, message: "产品类别为必填项", trigger: "blur" }],
  etype: [{ required: true, message: "产品种类为必填项", trigger: "blur" }]
});
