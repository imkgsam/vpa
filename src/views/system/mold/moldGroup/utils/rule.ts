import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  name: [{ required: true, message: "模组名称为必填项", trigger: "blur" }],
  manager: [{ required: true, message: "管理员为必选项", trigger: "blur" }],
  workers: [{ required: true, message: "工人为必选项", trigger: "blur" }],
  mtype: [{ required: true, message: "类型为必选项", trigger: "blur" }],
  department: [{ required: true, message: "部门为必选项", trigger: "blur" }],
  location: [{ required: true, message: "地点为必选项", trigger: "blur" }]
});
