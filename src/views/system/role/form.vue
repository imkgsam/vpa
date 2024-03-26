<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import { usePublicHooks } from "../hooks";

const { switchStyle } = usePublicHooks();

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    code: "",
    meta: {
      enabled: false
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
    label-width="100px"
  >
    <el-row :gutter="30">
      <el-col>
        <el-form-item label="角色code" prop="code">
          <el-input
            v-model="newFormInline.code"
            clearable
            placeholder="请输入角色code"
          />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="部门状态">
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
    </el-row>
  </el-form>
</template>
