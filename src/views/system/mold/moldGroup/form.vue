<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import { usePublicThemeHooks } from "@/helpers/theme";

const { switchStyle } = usePublicThemeHooks();

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    _id: "",
    code: "",
    startsWith: "",
    remark: "",
    length: undefined,
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
    label-width="120px"
  >
    <el-row :gutter="30">
      <el-col>
        <el-form-item label="条码类型名称" prop="code">
          <el-input
            v-model="newFormInline.code"
            clearable
            placeholder="请输入条码类型名称(英文)"
          />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="类型前缀" prop="startsWith">
          <el-input
            v-model="newFormInline.startsWith"
            clearable
            placeholder="请输入条码类型前缀"
          />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="条码类型长度" prop="length">
          <el-input-number
            v-model.number="newFormInline.length"
            clearable
            placeholder="请输入条码类型长度"
          />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="条码类型备注" prop="remark">
          <el-input
            v-model="newFormInline.remark"
            type="textarea"
            autosize
            clearable
            placeholder="请输入条码类型备注"
          />
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
    </el-row>
  </el-form>
</template>
