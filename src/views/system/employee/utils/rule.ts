import { reactive } from "vue";
import type { FormRules } from "element-plus";
import {
  // isPhone,
  isEmail
} from "@pureadmin/utils";

/** 自定义表单规则校验 */

const email = [
  {
    required: true,
    validator: (rule, value, callback) => {
      if (value === "") {
        callback();
      } else if (!isEmail(value)) {
        callback(new Error("请输入正确的邮箱格式"));
      } else {
        callback();
      }
    },
    trigger: "blur"
  }
];

// const phone = [
//   {
//     validator: (rule, value, callback) => {
//       if (value === "") {
//         callback();
//       } else if (!isPhone(value)) {
//         callback(new Error("请输入正确的手机号码格式"));
//       } else {
//         callback();
//       }
//     },
//     trigger: "blur"
//     // trigger: "click" // 如果想在点击确定按钮时触发这个校验，trigger 设置成 click 即可
//   }
// ]

export const formRules = reactive(<FormRules>{
  name: [{ required: true, message: "成员名称为必填项", trigger: "blur" }],
  personal: {
    sex: [{ required: true, message: "成员性别为必填项", trigger: "blur" }]
    // birth: [ { required: true, message: "成员生日为必填项", trigger: "blur" } ]
  },
  account: {
    accountName: [
      { required: true, message: "用户名称为必填项", trigger: "blur" }
    ],
    password: [
      { required: true, message: "用户密码为必填项", trigger: "blur" }
    ],
    passwordReset: [
      { required: false, message: "用户新密码为可选项", trigger: "blur" }
    ],
    email: email
  },
  employee: {
    etype: [{ required: true, message: "员工类型为必填项", trigger: "blur" }]
  }
});
