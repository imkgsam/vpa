<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "../utils/rule";
import { FormProps } from "../utils/types";
import { usePublicThemeHooks } from "@/helpers/theme";
import { transformI18n } from "@/plugins/i18n";
import { storeToRefs } from "pinia";
import { usePublicConstantHooks } from "@/helpers/constant";
import { usePublicAppVariableHooks } from "@/helpers/appVariables";

import { usePublicStoreHook } from "@/store/modules/public";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    title: "新增",
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
      isEmployee: true,
      isUser: undefined
    },
    account: {
      _id: null,
      accountName: "",
      email: "",
      phone: "",
      password: "",
      passwordReset: "",
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
      inaugurationDate: null,
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

const {
  publicEmployees: employeeOptions,
  publicDepartments: departmentOptions,
  publicRoles: roleOptions,
  publicCompanies: companyOptions,
  departmentOptionsTree
} = storeToRefs(usePublicStoreHook());
const { countryOptions, sexOptions } = usePublicConstantHooks();
const {
  employeeTypeOptions,
  probationResultTypeOptions,
  EducationTypeOptions,
  MaritalStatusTypeOptions
} = usePublicAppVariableHooks();

const ruleFormRef = ref();
const { switchStyle } = usePublicThemeHooks();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}

onBeforeMount(async () => {
  usePublicStoreHook().getAllPublicDepartments(false);
  usePublicStoreHook().getAllPublicRoles(false);
  usePublicStoreHook().getAllPublicCompanies(false);
  usePublicStoreHook().getAllPublicEmployees(false);
  console.log(" in nBeforeMount");
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
      <!-- entity: 真实姓名 -->
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="真实姓名" prop="name">
          <el-input
            v-model="newFormInline.name"
            clearable
            placeholder="请输入真实姓名"
          />
        </el-form-item>
      </re-col>
      <!-- entity: 别称 -->
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="个体别称" prop="alias">
          <el-input
            v-model="newFormInline.alias"
            clearable
            placeholder="请输入个体别称"
          />
        </el-form-item>
      </re-col>
      <!-- entity: 别称 -->
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="个人手机" prop="common.mobilePhone">
          <el-input
            v-model="newFormInline.common.mobilePhone"
            clearable
            placeholder="请输入个人手机号"
          />
        </el-form-item>
      </re-col>
      <!-- entity: 邮箱 -->
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="个人邮箱" prop="common.email">
          <el-input
            v-model="newFormInline.common.email"
            clearable
            placeholder="请输入个人邮箱"
          />
        </el-form-item>
      </re-col>
      <!-- entity: 主页 -->
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="个人主页" prop="common.website">
          <el-input
            v-model="newFormInline.common.email"
            clearable
            placeholder="请输入个人主页"
          />
        </el-form-item>
      </re-col>
      <!-- entity: 固话 -->
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="个人固话" prop="common.landline">
          <el-input
            v-model="newFormInline.common.landline"
            clearable
            placeholder="请输入个人固话"
          />
        </el-form-item>
      </re-col>
      <!-- entity: 性别 -->
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="用户性别" prop="personal.sex">
          <el-select
            v-model="newFormInline.personal.sex"
            placeholder="请选择用户性别"
            filterable
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
      <!-- entity: 生日 -->
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="个人生日" prop="personal.birth">
          <el-date-picker
            ref="datePickerRef"
            v-model="newFormInline.personal.birth"
            type="date"
            placeholder="请选择出生日期"
          />
        </el-form-item>
      </re-col>
      <!-- entity: 所属公司 -->
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="所属公司">
          <el-select
            v-model="newFormInline.scompany"
            placeholder="请选择所属公司"
            class="w-full"
            clearable
          >
            <el-option
              v-for="(item, index) in companyOptions"
              :key="index"
              :label="item.name"
              :value="item._id"
            />
          </el-select>
        </el-form-item>
      </re-col>
      <!-- entity: 公司职位 -->
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="公司职位" prop="personal.jobTitle">
          <el-input
            v-model="newFormInline.personal.jobTitle"
            clearable
            placeholder="请输入所属公司职位"
          />
        </el-form-item>
      </re-col>
      <!-- entity: 所在国家 -->
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="所属国家">
          <el-select
            v-model="newFormInline.common.country"
            placeholder="请选择所属国家"
            class="w-full"
            clearable
          >
            <el-option
              v-for="(item, index) in countryOptions"
              :key="index"
              :label="item.cn"
              :value="item.en"
            />
          </el-select>
        </el-form-item>
      </re-col>
      <!-- entity: 所在城市 -->
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="所在城市" prop="common.city">
          <el-input
            v-model="newFormInline.common.city"
            clearable
            placeholder="请输入所在城市"
          />
        </el-form-item>
      </re-col>
      <!-- entity: 从事行业 -->
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="从事行业" prop="common.industry">
          <el-input
            v-model="newFormInline.common.industry"
            clearable
            placeholder="请输入从事行业"
          />
        </el-form-item>
      </re-col>
      <!-- entity: 内部备注 -->
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="内部备注" prop="common.internalNote">
          <el-input
            v-model="newFormInline.common.internalNote"
            clearable
            placeholder="请输入内部备注"
          />
        </el-form-item>
      </re-col>
      <el-divider />
      <!-- entity: 内部备注 -->
      <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
        <el-checkbox
          v-model="newFormInline.meta.enabled"
          label="是否已启用"
          size="large"
        />
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
        <el-checkbox
          v-model="newFormInline.meta.verified"
          label="是否已认证"
          size="large"
        />
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
        <el-checkbox
          v-model="newFormInline.meta.isEmployee"
          disabled
          label="是否为员工"
          size="large"
        />
      </el-col>
      <el-col
        v-if="newFormInline.meta.isEmployee"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
        :xl="4"
      >
        <el-checkbox
          v-model="newFormInline.employee.meta.enabled"
          label="启用员工"
          size="large"
        />
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
        <el-checkbox
          v-model="newFormInline.meta.isCustomer"
          label="是否为客户"
          size="large"
        />
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
        <el-checkbox
          v-model="newFormInline.meta.isSupplier"
          label="是否为供应商"
          size="large"
        />
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
        <el-checkbox
          v-model="newFormInline.meta.isUser"
          label="是否为系统用户"
          size="large"
        />
      </el-col>
      <el-col
        v-if="newFormInline.meta.isUser"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
        :xl="4"
      >
        <el-checkbox
          v-model="newFormInline.account.meta.enabled"
          label="启用账户"
          size="large"
        />
      </el-col>
      <el-col
        v-if="newFormInline.meta.isUser"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
        :xl="4"
      >
        <el-checkbox
          v-model="newFormInline.account.meta.verified"
          label="账户已认证"
          size="large"
        />
      </el-col>
      <!-- 员工信息 -->
      <el-divider v-if="newFormInline.meta.isEmployee"> 员工信息 </el-divider>
      <!-- employee 员工类型  -->
      <re-col
        v-if="newFormInline.meta.isEmployee"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="员工类型" prop="employee.etype">
          <el-select
            v-model="newFormInline.employee.etype"
            placeholder="请选择员工类型"
            class="w-full"
            clearable
          >
            <el-option
              v-for="(item, index) in employeeTypeOptions"
              :key="index"
              :label="item.cn"
              :value="item.en"
            />
          </el-select>
        </el-form-item>
      </re-col>
      <!-- employee 所属部门  -->
      <re-col
        v-if="newFormInline.meta.isEmployee"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="所属部门s" prop="employee.departments">
          <el-cascader
            v-model="newFormInline.employee.departments"
            class="w-full"
            collapse-tags
            :options="departmentOptionsTree"
            :props="{
              value: '_id',
              label: 'name',
              emitPath: false,
              checkStrictly: true,
              multiple: true
            }"
            clearable
            filterable
            placeholder="请选择所属部门s"
          >
            <template #default="{ node, data }">
              <span>{{ data.name }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>
      </re-col>
      <!-- employee 直属上级  -->
      <re-col
        v-if="newFormInline.meta.isEmployee"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="直属上级" prop="employee.manager">
          <el-select
            v-model="newFormInline.employee.manager"
            placeholder="请选择直属上级"
            class="w-full"
            clearable
          >
            <el-option
              v-for="(item, index) in newFormInline._id
                ? employeeOptions.filter(each => each._id !== newFormInline._id)
                : employeeOptions"
              :key="index"
              :label="item.name"
              :value="item._id"
            />
          </el-select>
        </el-form-item>
      </re-col>
      <!-- employee: 工作座机 -->
      <re-col
        v-if="newFormInline.meta.isEmployee"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="工作座机" prop="employee.workPhone">
          <el-input
            v-model="newFormInline.employee.workPhone"
            clearable
            placeholder="请输入工作座机"
          />
        </el-form-item>
      </re-col>
      <!-- employee: 工作手机 -->
      <re-col
        v-if="newFormInline.meta.isEmployee"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="工作手机" prop="employee.workMobile">
          <el-input
            v-model="newFormInline.employee.workMobile"
            clearable
            placeholder="请输入工作手机"
          />
        </el-form-item>
      </re-col>
      <!-- employee: 工作邮箱 -->
      <re-col
        v-if="newFormInline.meta.isEmployee"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="工作邮箱" prop="employee.workEmail">
          <el-input
            v-model="newFormInline.employee.workEmail"
            clearable
            placeholder="请输入工作邮箱"
          />
        </el-form-item>
      </re-col>
      <!-- employee: 入职日期 -->
      <re-col
        v-if="newFormInline.meta.isEmployee"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="入职日期" prop="employee.inaugurationDate">
          <el-date-picker
            ref="datePickerRef"
            v-model="newFormInline.employee.inaugurationDate"
            type="date"
            placeholder="请选择入职日期"
          />
        </el-form-item>
      </re-col>
      <el-divider v-if="newFormInline.meta.isEmployee">家庭信息</el-divider>
      <!-- employee-privacy-family: 婚姻状态 -->
      <re-col
        v-if="newFormInline.meta.isEmployee"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="婚姻状态" prop="employee.privacy.family.status">
          <el-select
            v-model="newFormInline.employee.privacy.family.status"
            placeholder="请选择婚姻状态"
            class="w-full"
            clearable
          >
            <el-option
              v-for="(item, index) in MaritalStatusTypeOptions"
              :key="index"
              :label="item.cn"
              :value="item.en"
            />
          </el-select>
        </el-form-item>
      </re-col>
      <!-- employee-privacy-family: 抚养儿童数 -->
      <re-col
        v-if="newFormInline.meta.isEmployee"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item
          label="抚养儿童数"
          prop="employee.privacy.family.dependentChildrenCount"
        >
          <el-input-number
            v-model="
              newFormInline.employee.privacy.family.dependentChildrenCount
            "
            :min="0"
            :max="10"
          />
        </el-form-item>
      </re-col>
      <el-divider v-if="newFormInline.meta.isEmployee">国籍信息</el-divider>
      <!-- employee-privacy-nationality: 出生国家 -->
      <re-col
        v-if="newFormInline.meta.isEmployee"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="出生国家">
          <el-select
            v-model="newFormInline.employee.privacy.nationality.country"
            placeholder="请选择出生国家"
            class="w-full"
            clearable
          >
            <el-option
              v-for="(item, index) in countryOptions"
              :key="index"
              :label="item.cn"
              :value="item.en"
            />
          </el-select>
        </el-form-item>
      </re-col>
      <!--  employee-privacy-nationality: 出生城市  -->
      <re-col
        v-if="newFormInline.meta.isEmployee"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="出生城市" prop="employee.privacy.nationality.city">
          <el-input
            v-model="newFormInline.employee.privacy.nationality.city"
            clearable
            placeholder="请输入出生城市"
          />
        </el-form-item>
      </re-col>
      <!-- 身份证号 -->
      <re-col
        v-if="newFormInline.meta.isEmployee"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="身份证号" prop="employee.privacy.nationality.ID">
          <el-input
            v-model="newFormInline.employee.privacy.nationality.ID"
            clearable
            placeholder="请输入身份证号"
          />
        </el-form-item>
      </re-col>
      <!--护照号 -->
      <re-col
        v-if="newFormInline.meta.isEmployee"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item
          label="护照号"
          prop="employee.privacy.nationality.passport"
        >
          <el-input
            v-model="newFormInline.employee.privacy.nationality.passport"
            clearable
            placeholder="请输入护照号"
          />
        </el-form-item>
      </re-col>
      <!-- 税号 -->
      <re-col
        v-if="newFormInline.meta.isEmployee"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="税号" prop="employee.privacy.nationality.taxNo">
          <el-input
            v-model="newFormInline.employee.privacy.nationality.taxNo"
            clearable
            placeholder="请输入税号"
          />
        </el-form-item>
      </re-col>
      <!-- 驾驶证号 -->
      <re-col
        v-if="newFormInline.meta.isEmployee"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item
          label="驾驶证号"
          prop="employee.privacy.nationality.driverLicense"
        >
          <el-input
            v-model="newFormInline.employee.privacy.nationality.driverLicense"
            clearable
            placeholder="请输入驾驶证号"
          />
        </el-form-item>
      </re-col>
      <el-divider v-if="newFormInline.meta.isEmployee">紧急联系</el-divider>
      <!-- 紧急联系人 -->
      <re-col
        v-if="newFormInline.meta.isEmployee"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item
          label="紧急联系人"
          prop="employee.privacy.emergency.contact"
        >
          <el-input
            v-model="newFormInline.employee.privacy.emergency.contact"
            clearable
            placeholder="请输入紧急联系人"
          />
        </el-form-item>
      </re-col>
      <!-- 联系方式 -->
      <re-col
        v-if="newFormInline.meta.isEmployee"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="联系方式" prop="employee.privacy.emergency.phone">
          <el-input
            v-model="newFormInline.employee.privacy.emergency.phone"
            clearable
            placeholder="请输入联系方式"
          />
        </el-form-item>
      </re-col>
      <el-divider v-if="newFormInline.meta.isEmployee">教育</el-divider>
      <!-- 最高学历 -->
      <re-col
        v-if="newFormInline.meta.isEmployee"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="最高学历" prop="employee.education.qulification">
          <el-select
            v-model="newFormInline.employee.education.qulification"
            placeholder="请选择最高学历"
            class="w-full"
            clearable
          >
            <el-option
              v-for="(item, index) in EducationTypeOptions"
              :key="index"
              :label="item.cn"
              :value="item.en"
            />
          </el-select>
        </el-form-item>
      </re-col>
      <!-- 毕业院校 -->
      <re-col
        v-if="newFormInline.meta.isEmployee"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="毕业院校" prop="employee.education.school">
          <el-input
            v-model="newFormInline.employee.education.school"
            clearable
            placeholder="请输入毕业院校"
          />
        </el-form-item>
      </re-col>
      <!-- 毕业日期 -->
      <re-col
        v-if="newFormInline.meta.isEmployee"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="毕业日期" prop="employee.education.graduatedAt">
          <el-date-picker
            ref="datePickerRef"
            v-model="newFormInline.employee.education.graduatedAt"
            type="date"
            placeholder="请选择毕业日期"
          />
        </el-form-item>
      </re-col>
      <!-- 就读专业 -->
      <re-col
        v-if="newFormInline.meta.isEmployee"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="就读专业" prop="employee.education.major">
          <el-input
            v-model="newFormInline.employee.education.major"
            clearable
            placeholder="请输入就读专业"
          />
        </el-form-item>
      </re-col>

      <el-divider v-if="newFormInline.meta.isUser"> 账户信息 </el-divider>
      <!-- 用户名 -->
      <re-col v-if="newFormInline.meta.isUser" :value="12" :xs="24" :sm="24">
        <el-form-item label="用户名" prop="account.accountName">
          <el-input
            v-model="newFormInline.account.accountName"
            clearable
            placeholder="请输入用户名"
          />
        </el-form-item>
      </re-col>
      <!-- 登录邮箱 -->
      <re-col v-if="newFormInline.meta.isUser" :value="12" :xs="24" :sm="24">
        <el-form-item label="登录邮箱" prop="account.email">
          <el-input
            v-model="newFormInline.account.email"
            clearable
            placeholder="请输入登录邮箱"
          />
        </el-form-item>
      </re-col>
      <!-- 登录手机 -->
      <re-col v-if="newFormInline.meta.isUser" :value="12" :xs="24" :sm="24">
        <el-form-item label="登录手机" prop="account.phone">
          <el-input
            v-model="newFormInline.account.phone"
            clearable
            placeholder="请输入登录手机"
          />
        </el-form-item>
      </re-col>
      <!-- 创建密码 -->
      <re-col
        v-if="newFormInline.title === '新增' && newFormInline.meta.isUser"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="初始密码" prop="account.password">
          <el-input
            v-model.password="newFormInline.account.password"
            clearable
            type="password"
            autocomplete="new-password"
            show-password
            placeholder="请输入用户初始密码"
          />
        </el-form-item>
      </re-col>
      <!-- 重置密码 -->
      <re-col
        v-if="newFormInline.title === '修改' && newFormInline.meta.isUser"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="重置密码" prop="account.passwordReset">
          <el-input
            v-model="newFormInline.account.passwordReset"
            clearable
            show-password
            type="password"
            autocomplete="new-password"
            placeholder="请输入用户重置密码"
          />
        </el-form-item>
      </re-col>
      <!-- 用户权限  -->
      <re-col v-if="newFormInline.meta.isUser" :value="12" :xs="24" :sm="24">
        <el-form-item label="角色权限" prop="account.roles">
          <el-select
            v-model="newFormInline.account.roles"
            collapse-tags
            placeholder="请选择角色权限"
            class="w-full"
            multiple
            clearable
          >
            <el-option
              v-for="(item, index) in roleOptions"
              :key="index"
              :label="transformI18n(`constant.roles.${item.code}`)"
              :value="item._id"
            />
          </el-select>
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
