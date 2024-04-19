<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import { usePublicThemeHooks } from "@/helpers/theme";
import { useHook } from "./utils/hook";

const { switchStyle } = usePublicThemeHooks();
const { supplierOptions, allMoldItems } = useHook();

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    _id: "",
    supplier: null,
    mold: null,
    product: null,
    attributes: [],
    mtype: "",
    group: {
      moldGroup: null,
      index: 0
    },
    barcode: null,
    maxGroutingTimes: 0,
    initialGroutingTimes: 0,
    warningThreadhold: 0,
    cumulativeGroutingTimes: 0,
    meta: {
      enabled: false,
      inUse: false,
      isScraped: false,
      scrapDate: null,
      batch: ""
    },
    remark: ""
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
        <el-form-item label="供应商" prop="supplier">
          <el-select
            v-model="newFormInline.supplier"
            placeholder="请选择供应商"
            class="w-full"
            clearable
          >
            <el-option
              v-for="(item, index) in supplierOptions"
              :key="index"
              :label="item.name"
              :value="item._id"
            />
          </el-select>
        </el-form-item>
      </el-col>

      <el-col>
        <el-form-item label="模具ITEM" prop="mold">
          <el-select
            v-model="newFormInline.mold"
            placeholder="请选择模具"
            class="w-full"
            clearable
          >
            <el-option
              v-for="(item, index) in allMoldItems"
              :key="index"
              :label="item.alias"
              :value="item._id"
            />
          </el-select>
        </el-form-item>
      </el-col>

      <el-col>
        <el-form-item label="模具状态">
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
