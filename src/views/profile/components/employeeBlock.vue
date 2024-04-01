<script setup lang="ts">
import { ref, reactive, onBeforeMount, toRaw, onMounted } from "vue";
import { Entity, Employee } from "@/store/modules/types";
import { useI18n } from "vue-i18n";
import { FormInstance } from "element-plus";
import { merge } from "lodash";
import { formatInaugurationDays } from "@/utils/stringUtils";
import { formatDate } from "@/utils/dateUtils";

const ruleFormRef = ref<FormInstance>();
const { t } = useI18n();

defineOptions({
  name: "EmployeeBlock"
});
const props = defineProps(["employee"]);
const editing = ref(false);
const loading = ref(false);
var dataForm = reactive<Employee>({
  _id: "",
  etype: "Fulltime",
  departments: [],
  manager: {
    _id: "",
    name: "",
    etype: "Person"
  },
  workPhone: "",
  workMobile: "",
  workEmail: "",
  EID: "",
  ETL: "",
  inaugurationDate: null,
  // probation: {
  //   startDate: boolean;
  //   period: number;
  //   actualEndDate: Date;
  //   result: string;
  //   note: string;
  // },
  privacy: {
    family: {
      status: "",
      dependentChildrenCount: 0
    },
    nationality: {
      country: "",
      city: "",
      birth: null,
      ID: "",
      passport: "",
      taxNo: "",
      driverLicense: ""
    },
    emergency: {
      contact: "",
      phone: ""
    }
  },
  education: {
    qulification: "",
    school: "",
    graduatedAt: null,
    major: ""
  }
});

onBeforeMount(() => {
  Object.assign(dataForm, props.employee);
});

async function save() {
  if (!editing.value) {
    console.log("editing...");
    editing.value = !editing.value;
  } else {
    loading.value = true;
    console.log("saving...");
    setTimeout(() => {
      loading.value = false;
      editing.value = !editing.value;
    }, 3000);
  }
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

async function cancle(formEl: FormInstance | undefined) {
  resetForm(formEl);
  merge(dataForm, props.employee);
  editing.value = !editing.value;
}
</script>

<template>
  <div>
    <el-form>
      <el-row :gutter="30">
        <el-col :xs="24" :lg="12">
          <div>
            <el-divider>基本员工信息</el-divider>
            <el-form-item :label="t('label.employeeEtype')">
              <span>{{ t(`value.${props.employee.etype}`) }}</span>
            </el-form-item>
            <el-form-item :label="t('label.EID')">
              <span>{{ props.employee.EID || "无" }}</span>
            </el-form-item>
            <el-form-item :label="t('label.ETL')">
              <span>{{ props.employee.ETL || "无" }}</span>
            </el-form-item>
            <el-form-item :label="t('label.inaugurationDate')">
              <span>{{
                formatDate(props.employee.inaugurationDate) || "无"
              }}</span>
            </el-form-item>
            <el-form-item :label="t('label.inaugurationDayCount')">
              <span
                >{{
                  formatInaugurationDays(props.employee.inaugurationDate)
                }}
                天</span
              >
            </el-form-item>
            <el-form-item :label="t('label.department')">
              <div v-if="props.employee.departments.length > 0">
                <el-tag
                  v-for="(dpt, idx) in props.employee.departments"
                  :key="idx"
                  type="success"
                  size="small"
                >
                  {{ dpt.name }}
                </el-tag>
              </div>
              <span v-else>无</span>
            </el-form-item>
            <el-form-item :label="t('label.manager')">
              <span>{{ props.employee.manager?.name || "无" }}</span>
            </el-form-item>
            <el-form-item :label="t('label.workPhone')">
              <span>{{ props.employee.workPhone || "无" }}</span>
            </el-form-item>
            <el-form-item :label="t('label.workMobile')">
              <span>{{ props.employee.workMobile || "无" }}</span>
            </el-form-item>
            <el-form-item :label="t('label.workEmail')">
              <span>{{ props.employee.workEmail || "无" }}</span>
            </el-form-item>
          </div>
          <div>
            <el-divider>{{ t("label.education") }}</el-divider>
            <el-form-item :label="t('label.educationQualification')">
              <span>{{ props.employee.education?.qualification || "无" }}</span>
            </el-form-item>
            <el-form-item :label="t('label.school')">
              <span>{{ props.employee.education?.school || "无" }}</span>
            </el-form-item>
            <el-form-item :label="t('label.graduatedAt')">
              <span>{{ props.employee.education?.graduatedAt || "无" }}</span>
            </el-form-item>
          </div>
        </el-col>
        <el-col :xs="24" :lg="12">
          <div>
            <el-divider>{{ t("label.family") }}</el-divider>
            <el-form-item :label="t('label.familyStatus')">
              <span>{{ props.employee.privacy?.family.status || "无" }}</span>
            </el-form-item>
            <el-form-item :label="t('label.childrenNumber')">
              <span>{{
                props.employee.privacy?.family.dependentChildrenCount || "无"
              }}</span>
            </el-form-item>
          </div>
          <div>
            <el-divider>{{ t("label.nationality") }}</el-divider>
            <el-form-item :label="t('label.ncountry')">
              <span>{{
                props.employee.privacy?.nationality.country || "无"
              }}</span>
            </el-form-item>
            <el-form-item :label="t('label.bcity')">
              <span>{{
                props.employee.privacy?.nationality.city || "无"
              }}</span>
            </el-form-item>
            <el-form-item :label="t('label.birth')">
              <span>{{
                props.employee.privacy?.nationality.birth || "无"
              }}</span>
            </el-form-item>
            <el-form-item :label="t('label.id')">
              <span>{{ props.employee.privacy?.nationality.ID || "无" }}</span>
            </el-form-item>
            <el-form-item :label="t('label.passport')">
              <span>{{
                props.employee.privacy?.nationality.passport || "无"
              }}</span>
            </el-form-item>
            <el-form-item :label="t('label.driverLicense')">
              <span>{{ props.employee.privacy?.nationality.id || "无" }}</span>
            </el-form-item>
            <el-form-item :label="t('label.taxNo')">
              <span>{{
                props.employee.privacy?.nationality.passport || "无"
              }}</span>
            </el-form-item>
          </div>
          <div>
            <el-divider>{{ t("label.emergency") }}</el-divider>
            <el-form-item :label="t('label.emergencyContact')">
              <span>{{
                props.employee.privacy?.emergency?.contact || "无"
              }}</span>
            </el-form-item>
            <el-form-item :label="t('label.contactPhone')">
              <span>{{
                props.employee.privacy?.emergency?.phone || "无"
              }}</span>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-form-item class="flex right">
        <el-button
          v-if="editing"
          :loading="loading"
          type="default"
          @click="cancle(ruleFormRef)"
        >
          {{ "取消" }}
        </el-button>
        <el-button
          :loading="loading"
          :type="editing ? 'primary' : 'warning'"
          @click="save"
          >{{ editing ? "保存" : "修改" }}</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
