<script setup lang="ts">
import { ref, reactive, onMounted, toRaw, onBeforeMount, watch } from "vue";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import { useUserStoreHook } from "@/store/modules/user";
import { Entity } from "@/store/modules/types";
import { merge, assign } from "lodash";
import { FormInstance } from "element-plus";
import { usePublicConstantHooks } from "@/helpers/constant";

const ruleFormRef = ref<FormInstance>();
const { t } = useI18n();
defineOptions({
  name: "EntityBlock"
});
const editing = ref(false);
const loading = ref(false);
const props = defineProps(["entity"]);

const { countryOptions } = usePublicConstantHooks();

var dataForm = reactive<Entity>({
  _id: "",
  name: "",
  alias: "",
  etype: "",
  scompany: {
    _id: "",
    name: "",
    alias: "",
    etype: ""
  },
  personal: {
    jobTitle: "",
    sex: null,
    birth: null
  },
  enterprise: {
    manager: "",
    foundedAt: null,
    taxNum: ""
  },
  common: {
    website: "",
    email: "",
    landline: "",
    mobilePhone: "",
    country: "",
    city: "",
    industry: "",
    internalNote: ""
  },
  socialMedias: []
});

onBeforeMount(() => {
  merge(dataForm, props.entity);
});

// watch(props.entity, () => {
//   merge(dataForm, props.entity)
// })

async function save() {
  if (!editing.value) {
    editing.value = !editing.value;
  } else {
    loading.value = true;
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
  merge(dataForm, props.entity);
  editing.value = !editing.value;
}
</script>

<template>
  <div>
    <el-form ref="ruleFormRef" :model="dataForm">
      <el-row :gutter="25">
        <el-col v-motion :xz="24" :lg="12">
          <div>
            <el-divider>个人信息</el-divider>
            <el-form-item :label="t('label.fullName')">
              <!-- <el-input v-if="editing" :value="props.entity.name" v-model="dataForm.name" /> -->
              <span>{{ props.entity.name }}</span>
            </el-form-item>
            <el-form-item
              v-if="props.entity.etype === 'Person'"
              :label="t('label.sex')"
            >
              <el-radio-group
                v-model="dataForm.personal.sex"
                :value="props.entity.personal.sex"
                :disabled="!editing"
              >
                <el-radio label="Male">男性</el-radio>
                <el-radio label="Female">女性</el-radio>
                <el-radio label="Others">其他</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-if="props.entity.etype === 'Person'"
              :label="t('label.birth')"
            >
              <!-- <span> {{ props.entity.personal.birth || "无" }}</span> -->
              <el-date-picker
                v-model="dataForm.personal.birth"
                :disabled="!editing"
                type="date"
                :placeholder="t('common.text.pickADate')"
              />
            </el-form-item>
            <el-form-item :label="t('label.pemail')">
              <el-input v-if="editing" v-model="dataForm.common.email" />
              <span v-else>{{ props.entity.common?.email || "无" }}</span>
            </el-form-item>
            <el-form-item :label="t('label.pwebsite')">
              <el-input v-if="editing" v-model="dataForm.common.website" />
              <span v-else>{{ props.entity.common?.website || "无" }}</span>
            </el-form-item>
            <el-form-item :label="t('label.plandline')">
              <el-input v-if="editing" v-model="dataForm.common.landline" />
              <span v-else>{{ props.entity.common?.landline || "无" }}</span>
            </el-form-item>
            <el-form-item :label="t('label.pmobilePhone')">
              <el-input v-if="editing" v-model="dataForm.common.mobilePhone" />
              <span v-else>{{ props.entity.common?.mobilePhone || "无" }}</span>
            </el-form-item>
            <el-form-item :label="t('label.incountry')">
              <el-select
                v-model="dataForm.common.country"
                :value="dataForm.common.country"
                filterable
                :disabled="!editing"
                clearable
                placeholder="Select"
              >
                <el-option
                  v-for="(item, idx) in countryOptions"
                  :key="idx"
                  :label="item.cn"
                  :value="item.en"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="t('label.incity')">
              <el-input v-if="editing" v-model="dataForm.common.city" />
              <span v-else> {{ props.entity.common?.city || "无" }}</span>
            </el-form-item>
            <!-- <el-form-item :label="t('label.etype')">
              <el-radio-group v-model="props.entity.etype" disabled>
                <el-radio label="Person">个人</el-radio>
                <el-radio label="Company">公司</el-radio>
              </el-radio-group>
            </el-form-item> -->
          </div>
        </el-col>
        <el-col v-motion :xz="24" :lg="12">
          <div>
            <el-divider>基本信息</el-divider>
            <el-form-item
              v-if="props.entity.scompany"
              :label="t('label.scompany')"
            >
              <span>{{ props.entity.scompany?.name }}</span>
              <!-- <el-input v-else :value="dataForm.scompany?.name" /> -->
            </el-form-item>
            <el-form-item
              v-if="props.entity.etype === 'Person'"
              :label="t('label.jobTitle')"
            >
              <!-- <el-input v-if="editing" v-model="dataForm.personal.jobTitle" /> -->
              <span>{{ props.entity.personal?.jobTitle || "无" }}</span>
            </el-form-item>
            <!-- <el-form-item :label="t('label.alias')">
              <el-input v-if="editing" v-model="dataForm.alias" />
              <span>{{ props.entity.alias || '无' }}</span>
            </el-form-item> -->
            <el-form-item :label="t('label.industry')">
              <span> {{ props.entity.common?.industry || "无" }}</span>
            </el-form-item>
            <el-form-item :label="t('label.verificationStatus')">
              <el-tag
                :type="props.entity.meta.verified ? 'success' : 'danger'"
                size="small"
              >
                {{
                  props.entity.meta.verified
                    ? t("label.verified")
                    : t("label.unverified")
                }}
              </el-tag>
            </el-form-item>
          </div>
        </el-col>
        <el-col v-motion :xs="24">
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
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
