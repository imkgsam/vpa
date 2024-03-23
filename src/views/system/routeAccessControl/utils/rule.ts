import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  user: [{ required: false, message: "角色名称为必填项", trigger: "blur" }],
  role: [{ required: false, message: "角色名称为必填项", trigger: "blur" }],
  route: [{ required: true, message: "角色名称为必填项", trigger: "blur" }],
  auths: [{ required: false, message: "auth可为空", trigger: "blur" }]
});
