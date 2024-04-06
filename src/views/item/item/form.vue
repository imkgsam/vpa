<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import { useHook } from "./utils/hook";

const { categoriesOptions, ItemTypeOptions } = useHook();

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    _id: undefined,
    code: "",
    category: undefined,
    etype: "",
    meta: {
      enabled: undefined,
      canBeStocked: undefined,
      canBeSold: undefined,
      canBePurchased: undefined,
      canBenProduced: undefined,
      canBenRented: undefined,
      hasVariants: undefined,
      isVariantOf: undefined,
      attributeTags: []
    },
    attributes: []
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
    label-width="82px"
  >
    <el-row :gutter="30">
      <el-col :xs="24">
        <el-form-item label="产品型号" prop="code">
          <el-input
            v-model="newFormInline.code"
            clearable
            placeholder="请输入产品型号"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="30">
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="是否已启用">
          <el-checkbox v-model="newFormInline.meta.enabled" />
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="是否可库存">
          <el-checkbox v-model="newFormInline.meta.canBeStocked" />
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="是否可出售">
          <el-checkbox v-model="newFormInline.meta.canBeSold" />
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="是否可采购">
          <el-checkbox v-model="newFormInline.meta.canBePurchased" />
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="是否可生产">
          <el-checkbox v-model="newFormInline.meta.canBenProduced" />
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8">
        <el-form-item label="是否可出租">
          <el-checkbox v-model="newFormInline.meta.canBenRented" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-tabs type="border-card">
      <el-tab-pane label="基本信息">
        <el-row :gutter="30">
          <el-col :xs="24" :sm="12">
            <el-form-item label="所属分类" prop="category">
              <el-cascader
                v-model="newFormInline.category"
                class="w-full"
                collapse-tags
                :options="categoriesOptions"
                :props="{
                  value: '_id',
                  label: 'name',
                  emitPath: false,
                  checkStrictly: true
                }"
                clearable
                filterable
                placeholder="请选择所属类别"
              >
                <template #default="{ node, data }">
                  <span>{{ data.name }}</span>
                  <span v-if="!node.isLeaf">
                    ({{ data.children.length }})
                  </span>
                </template>
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="产品类型" prop="etype">
              <el-select
                v-model="newFormInline.etype"
                placeholder="请选择产品类型"
              >
                <el-option
                  v-for="(itm, idx) in ItemTypeOptions"
                  :key="idx"
                  :label="itm.cn"
                  :value="itm.en"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="属性" />
      <el-tab-pane v-if="newFormInline.meta.canBeStocked" label="库存"
        >库存</el-tab-pane
      >
      <el-tab-pane v-if="newFormInline.meta.canBenProduced" label="生产"
        >生产</el-tab-pane
      >
      <el-tab-pane v-if="newFormInline.meta.canBenProduced" label="变体属性"
        >变体属性</el-tab-pane
      >
      <el-tab-pane v-if="newFormInline.meta.canBePurchased" label="采购"
        >采购</el-tab-pane
      >
      <el-tab-pane v-if="newFormInline.meta.canBeSold" label="销售"
        >销售</el-tab-pane
      >
      <el-tab-pane v-if="newFormInline.meta.canBenRented" label="租赁"
        >租赁</el-tab-pane
      >
    </el-tabs>
  </el-form>
</template>
