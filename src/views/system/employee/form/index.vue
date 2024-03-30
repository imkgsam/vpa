<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "../utils/rule";
import { FormProps } from "../utils/types";
import { usePublicHooks } from "../../hooks";
import { transformI18n } from "@/plugins/i18n";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    entity: {
      _id: null,
      name: "",
      alias: "",
      //种类，个人还是公司 EntityTypeEnum;
      etype: "Person",
      //对于个人是所属的公司，对于公司就是所属的母公司，可选
      scompany: null,
      personal: {
        //职位
        jobTitle: "",
        //性别
        sex: "",
        //生日
        birth: null
      },
      common: {
        website: "",
        //邮箱地址，个人-个人邮箱，公司-默认邮箱
        email: "",
        //固话
        landline: "",
        //手机
        mobilePhone: "",
        //所在国家
        country: "",
        //所在城市
        city: "",
        //行业
        industry: "",
        //内部备注
        internalNote: ""
      },
      //所有社交方式
      socialMedias: [],
      //关联的登录账户 可选
      account: null,
      //关联的员工账户 可选
      employee: null,
      meta: {
        //是否开启
        enabled: undefined,
        //是否已通过认证
        verified: undefined,
        //是否为我司供应商
        isSupplier: undefined,
        //是否为我司客户
        isCustomer: undefined,
        //是否为我司员工
        isEmployee: undefined
      }
    },
    account: {
      _id: null,
      accountName: "",
      email: "",
      phone: "",
      password: "",
      roles: [],
      entity: null,
      meta: {
        verified: undefined,
        enabled: undefined
      },
      security: {
        questions: {
          one: {
            question: "",
            answer: ""
          },
          two: {
            question: "",
            answer: ""
          },
          three: {
            question: "",
            answer: ""
          }
        }
      }
    },
    employee: {
      _id: null,
      entity: null,
      //种类，EmployeeTypeEnum;
      etype: "",
      //部门s,可隶属多个部门
      departments: [],
      //直系管理员，
      manager: null,
      //工作座机
      workPhone: "",
      //工作手机
      workMobile: "",
      //工作邮箱
      workEmail: "",
      //员工编号-(唯一识别号, [年]-[h3/1]-[月]-[h3/2]-[日]-[h3/3]-[性别] md5-hash后三位975 陈双鹏2024年01月01日入职男 2490170151 )
      //入职日期 = 试用期起始日期 = 进入公司的日期
      inauguratiionDate: null,
      //试用期
      probation: {
        //试用期开始时间
        startDate: new Date(),
        //计划试用时间 按天算
        period: 90
        //试用期实际结束日期：提前转正，延期试用
        // actualEndDate: Date;
        //试用期结果
        // result?: EmployeeTypeEnum;
        //试用期结果备注
        // note?: string;
      },
      //个人隐私
      privacy: {
        //家庭情况
        family: {
          //婚姻情况 MaritalStatusTypeEnum,
          status: "",
          //需抚养子女数量
          dependentChildrenCount: 0
        },
        //国籍
        nationality: {
          //出生国家
          country: "",
          //出生城市
          city: "",
          //出生日期
          birth: null,
          //身份证
          ID: "",
          //护照
          passport: "",
          //税号
          taxNo: "",
          //驾照号
          driverLicense: ""
        },
        //紧急联系
        emergency: {
          //联系人
          contact: "",
          //联系电话
          phone: ""
        }
      },
      //教育
      education: {
        //最高学历 EducationTypeEnum,
        qulification: null,
        //毕业院校
        school: "",
        //毕业日期
        graduatedAt: null,
        //专业
        major: ""
      },
      meta: {
        //是否有效，当试用期结束时，1.如果通过则开启，如果不通过则关闭
        enabled: undefined
      }
    }
  })
});

const sexOptions = ["Male", "Female", "Others"];
const ruleFormRef = ref();
const { switchStyle } = usePublicHooks();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}

onBeforeMount(async () => {
  console.log(" in nBeforeMount");
  console.log(props);
});

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="82px"
  >
    <el-row :gutter="30">
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="用户昵称" prop="nickname">
          <el-input
            v-model="newFormInline.nickname"
            clearable
            placeholder="请输入用户昵称"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="用户名称" prop="accountName">
          <el-input
            v-model="newFormInline.accountName"
            clearable
            placeholder="请输入用户名称"
          />
        </el-form-item>
      </re-col>

      <re-col
        v-if="newFormInline.title === '新增'"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="用户密码" prop="password">
          <el-input
            v-model="newFormInline.password"
            clearable
            placeholder="请输入用户密码"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="newFormInline.phone"
            clearable
            placeholder="请输入手机号"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="newFormInline.email"
            clearable
            placeholder="请输入邮箱"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="用户性别">
          <el-select
            v-model="newFormInline.entity.personal.sex"
            placeholder="请选择用户性别"
            class="w-full"
            clearable
          >
            <el-option
              v-for="(item, index) in sexOptions"
              :key="index"
              :label="transformI18n(`constant.gender.${item}`)"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="归属部门">
          <el-cascader
            v-model="newFormInline.parentId"
            class="w-full"
            :options="newFormInline.higherDeptOptions"
            :props="{
              value: 'id',
              label: 'name',
              emitPath: false,
              checkStrictly: true
            }"
            clearable
            filterable
            placeholder="请选择归属部门"
          >
            <template #default="{ node, data }">
              <span>{{ data.name }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>
      </re-col>
      <re-col
        v-if="newFormInline.title === '新增'"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="用户状态">
          <el-switch
            v-model="newFormInline.status"
            inline-prompt
            :active-value="1"
            :inactive-value="0"
            active-text="启用"
            inactive-text="停用"
            :style="switchStyle"
          />
        </el-form-item>
      </re-col>

      <re-col>
        <el-form-item label="备注">
          <el-input
            v-model="newFormInline.remark"
            placeholder="请输入备注信息"
            type="textarea"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
