<script setup lang="ts">
import { ref, watch, reactive } from "vue";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import { usePublicThemeHooks } from "@/helpers/theme";
import { useHook } from "./utils/hook";
import { Item } from "@/store/modules/types";

const { switchStyle } = usePublicThemeHooks();
const {
  supplierOptions,
  allMoldItems,
  moldTypeOptions,
  allProducibleItems,
  formatBarcodeString
} = useHook();

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
      index: null
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
const batchCreate = reactive({
  inBatch: false,
  count: 0
});

function getRef() {
  return ruleFormRef.value;
}

watch(
  () => newFormInline.value.mold,
  (n, o) => {
    console.log("in watch test object");
    let mold = null;
    if (n) {
      let l = allMoldItems.value.filter(each => each._id === n);
      if (l && l.length) {
        mold = l[0];
        const { product, maxGroutingTimes, warningThreadhold, mtype } =
          mold.mold;
        newFormInline.value.product = product;
        newFormInline.value.maxGroutingTimes = maxGroutingTimes;
        newFormInline.value.warningThreadhold = warningThreadhold;
        newFormInline.value.mtype = mtype;
      }
    }
  }
);

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
      <el-col :xs="24" :sm="12">
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
      <el-col :xs="24" :sm="12">
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
      <el-col :xs="24" :sm="12">
        <el-form-item label="对应产品" prop="mold">
          <el-select
            v-model="newFormInline.product"
            placeholder="请选择对应产品"
            class="w-full"
            clearable
          >
            <el-option
              v-for="(item, index) in allProducibleItems"
              :key="index"
              :label="item.alias"
              :value="item._id"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-form-item label="模具最高" prop="maxGroutingTimes">
          <el-input-number v-model="newFormInline.maxGroutingTimes" />
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-form-item label="模具预警" prop="warningThreadhold">
          <el-input-number v-model="newFormInline.warningThreadhold" />
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12">
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
      <el-col v-if="newFormInline?._id" :xs="24" :sm="12">
        <el-form-item label="模具编码" prop="barcode">
          <span>{{ formatBarcodeString(newFormInline?.barcode) || "无" }}</span>
        </el-form-item>
      </el-col>
      <el-col :xs="24">
        <el-form-item label="内部备注" prop="remark">
          <el-input v-model="newFormInline.remark" />
        </el-form-item>
      </el-col>

      <el-divider />
      <el-col :xs="24" :sm="12">
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
      <el-col :xs="24" :sm="12">
        <el-form-item label="批次" prop="meta.batch">
          <el-input v-model="newFormInline.meta.batch" />
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-form-item label="批量添加">
          <el-checkbox v-model="batchCreate.inBatch" />
        </el-form-item>
      </el-col>
      <el-col v-if="batchCreate.inBatch" :xs="24" :sm="12">
        <el-form-item label="批量数目">
          <el-input-number v-model="batchCreate.count" :min="1" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
