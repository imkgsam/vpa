<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import { usePublicThemeHooks } from "@/helpers/theme";
import { useHook } from "./utils/hook";
const { switchStyle } = usePublicThemeHooks();
import { transformI18n } from "@/plugins/i18n";

const {
  workerOptions,
  departmentOptionsTree,
  locationOptionsTree,
  moldTypeOptions,
  MoldGroupStatusOptions
} = useHook();

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    _id: "",
    name: "",
    manager: undefined,
    mtype: "",
    department: undefined,
    location: undefined,
    workers: [],
    meta: {
      enabled: false,
      status: ""
    }
  })
});

const ruleFormRef = ref();
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
    label-width="120px"
  >
    <el-row :gutter="30">
      <el-col>
        <el-form-item label="模组名称" prop="name">
          <el-input
            v-model="newFormInline.name"
            clearable
            placeholder="请输入模组名称"
          />
        </el-form-item>
      </el-col>
      <el-col :xs="24">
        <el-form-item label="类型" prop="mtype">
          <el-select
            v-model="newFormInline.mtype"
            clearable
            filterable
            placeholder="请选择类型"
          >
            <el-option
              v-for="(itm, idx) in moldTypeOptions"
              :key="idx"
              :label="itm.cn"
              :value="itm.en"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :xs="24">
        <el-form-item label="所属部门" prop="department">
          <el-cascader
            v-model="newFormInline.department"
            class="w-full"
            collapse-tags
            :options="departmentOptionsTree"
            :props="{
              value: '_id',
              label: 'name',
              emitPath: false,
              checkStrictly: true
            }"
            clearable
            filterable
            placeholder="请选择所属部门"
          >
            <template #default="{ node, data }">
              <span>{{ data.name }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>
      </el-col>
      <el-col :xs="24">
        <el-form-item label="所在地点" prop="location">
          <el-cascader
            v-model="newFormInline.location"
            class="w-full"
            collapse-tags
            :options="locationOptionsTree"
            :props="{
              value: '_id',
              label: 'name',
              emitPath: false,
              checkStrictly: true
            }"
            clearable
            filterable
            placeholder="请选择所在地点"
          >
            <template #default="{ node, data }">
              <span>{{ data.name }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="管理员" prop="manager">
          <el-select
            v-model="newFormInline.manager"
            placeholder="请选择管理员"
            clearable
          >
            <el-option
              v-for="(itm, idx) in workerOptions"
              :key="idx"
              :label="itm.name"
              :value="itm._id"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="操作工人" prop="workers">
          <el-select
            v-model="newFormInline.workers"
            placeholder="请选择操作工人"
            clearable
            multiple
          >
            <el-option
              v-for="(itm, idx) in workerOptions"
              :key="idx"
              :label="itm.name"
              :value="itm._id"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="类型状态">
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
      </el-col>
      <el-col v-if="newFormInline._id" :xs="24">
        <el-form-item label="状态" prop="meta.status">
          <el-select
            v-model="newFormInline.meta.status"
            clearable
            filterable
            :disabled="!newFormInline.meta.enabled"
            placeholder="请选择状态"
          >
            <el-option
              v-for="(itm, idx) in MoldGroupStatusOptions"
              :key="idx"
              :label="transformI18n(`constant.moldGroupStatus.${itm}`)"
              :value="itm"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
