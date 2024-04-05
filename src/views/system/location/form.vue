<script setup lang="ts">
import { ref, onBeforeMount, reactive } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import { usePublicThemeHooks } from "@/helpers/theme";
import { useEntityStoreHook } from "@/store/modules/entity";
import { usePublicStoreHook } from "@/store/modules/public";
import { storeToRefs } from "pinia";
import { usePublicAppVariableHooks } from "@/helpers/appVariables";

onBeforeMount(async () => {
  await useEntityStoreHook().getAllEmployees(false);
  await usePublicStoreHook().getAllPublicCompanies(false);
});

const { publicCompanies: companyOptions } = storeToRefs(usePublicStoreHook());

const { LocationTypeOptions } = usePublicAppVariableHooks();

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    title: "",
    higherDeptOptions: [],
    parent: "",
    name: "",
    ltype: "",
    company: null,
    meta: {
      enabled: null
    },
    color: ""
  })
});

const ruleFormRef = ref();
const { switchStyle } = usePublicThemeHooks();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="100px"
  >
    <el-row :gutter="30">
      <re-col>
        <el-form-item label="上级地点">
          <el-cascader
            v-model="newFormInline.parent"
            class="w-full"
            :options="newFormInline.higherDeptOptions"
            :props="{
              value: '_id',
              label: 'name',
              emitPath: false,
              checkStrictly: true
            }"
            clearable
            filterable
            placeholder="请选择上级地点"
          >
            <template #default="{ node, data }">
              <span>{{ data.name }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="地点名称" prop="name">
          <el-input
            v-model="newFormInline.name"
            clearable
            placeholder="请输入地点名称"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="类型">
          <el-select
            v-model="newFormInline.ltype"
            clearable
            placeholder="Select"
          >
            <el-option
              v-for="item in LocationTypeOptions"
              :key="item.en"
              :label="item.cn"
              :value="item.en"
            />
          </el-select>
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="所属公司">
          <el-select
            v-model="newFormInline.company"
            clearable
            placeholder="Select"
            :disabled="newFormInline.company && newFormInline.title === '新增'"
          >
            <el-option
              v-for="item in companyOptions"
              :key="item._id"
              :label="item.name"
              :value="item._id"
            />
          </el-select>
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="地点状态">
          <el-switch
            v-model="newFormInline.meta.enabled"
            inline-prompt
            :active-value="true"
            :inactive-value="false"
            active-text="启用"
            inactive-text="停用"
            :style="switchStyle"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
