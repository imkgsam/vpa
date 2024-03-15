<script setup lang="ts">
import { ref, reactive } from "vue";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import { useHook } from "./utils/hook";

const { handleAttributeValueEdit, handleAttributeValueDelete } = useHook();

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    name: "",
    code: "",
    meta: {
      enabled: null
    },
    values: [
      {
        _id: "lkjwerklj23lk4j2lk3j4",
        code: "black",
        name: "黑色",
        abbr: "BLK"
      },
      { _id: "lkjwerklj23lk4j2lk3j42", code: "red", name: "红色", abbr: "RED" },
      { _id: "lkjwerklj23lk4j2lk3j3", code: "pink", name: "粉色", abbr: "PNK" }
    ]
  })
});

const state = reactive({
  search: ""
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
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <el-form-item label="属性名称" prop="name">
          <el-input
            v-model="newFormInline.name"
            clearable
            placeholder="请输入属性名称"
          />
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <el-form-item label="属性代码" prop="code">
          <el-input
            v-model="newFormInline.code"
            clearable
            placeholder="请输入属性代码"
          />
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <strong class="pl-3"> 状态: </strong>
        <el-switch
          v-model="newFormInline.meta.enabled"
          active-text="启用"
          inactive-text="停用"
        />
      </el-col>
    </el-row>
    <el-divider />
    <el-table
      ref="valuesTableRef"
      :data="newFormInline.values"
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column type="index" width="50" />
      <el-table-column property="name" label="Name" />
      <el-table-column property="abbr" label="Abbreviation" />
      <el-table-column property="code" label="Code" width="120" />
      <el-table-column align="right">
        <template #header>
          <el-input
            v-model="state.search"
            size="small"
            placeholder="Type to search"
          />
        </template>
        <template #default="scope">
          <div class="flex">
            <el-button size="small" @click="handleAttributeValueEdit(scope.row)"
              >修改</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="handleAttributeValueDelete(scope.row)"
              >删除</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
</template>
