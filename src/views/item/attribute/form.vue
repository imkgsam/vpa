<script setup lang="ts">
import { ref, reactive, onBeforeMount, toRaw } from "vue";
import { formRules, form2Rules } from "./utils/rule";
import { FormProps } from "./utils/types";
import { useHook } from "./utils/hook";
import { ElMessage } from "element-plus";
import { AttributeAPI } from "@/api/system";
// import { AttributeValue } from './utils/types';
import dayjs from "dayjs";

onBeforeMount(async () => {
  if (newFormInline.value._id) {
    let data = await AttributeAPI.detail(newFormInline.value._id);
    console.log(data.data.values);
    newFormInline.value.values = data.data.values.map(each => {
      each.isEditing = false;
      return each;
    });
  }
});

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    _id: null,
    name: "",
    code: "",
    meta: {
      enabled: null
    },
    values: []
  })
});

const form: AttributeValue = {
  _id: null,
  name: "",
  code: "",
  abbr: "",
  attribute: null,
  isEditing: false
};

const editDefaultForm = {
  name: "",
  code: "",
  abbr: ""
};

const state = reactive({
  search: "",
  form: { ...form },
  defaultForm: { ...editDefaultForm }
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
const valuesTableRef = ref();
const addValueFromRef = ref();

function getRef() {
  return ruleFormRef.value;
}
function addValue(formEl) {
  if (!formEl) return;
  formEl.validate(valid => {
    if (valid) {
      let matches = newFormInline.value.values.filter(
        each =>
          each.name === state.form.name ||
          each.code === state.form.code ||
          each.abbr === state.form.abbr
      );
      if (matches.length) ElMessage.error("数值已存在,请修改");
      else {
        newFormInline.value.values.push(JSON.parse(JSON.stringify(state.form)));
        resetFrom();
      }
    } else {
      return false;
    }
  });
}

function resetFrom() {
  state.form = { ...form };
}

function handleAttributeValueDelete(row) {
  newFormInline.value.values = newFormInline.value.values.filter(
    each => each.name != row.name
  );
}

function handleAttributeValueEdit(row) {
  row.isEditing = true;
  state.defaultForm = { ...row };
}

function handleAttributeValueSave(row) {
  if (!row.name || !row.code || !row.abbr) {
    ElMessage.error("数值不能为空");
  }
  let matches = newFormInline.value.values.filter(
    each =>
      each.name === row.name || each.code === row.code || each.abbr === row.abbr
  );
  if (matches.length > 1) {
    ElMessage.error("数值不能重复");
    row.name = state.defaultForm.name;
    row.code = state.defaultForm.code;
    row.abbr = state.defaultForm.abbr;
  } else {
    state.defaultForm = { ...editDefaultForm };
    row.isEditing = false;
  }
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
    <el-divider content-position="left"> 属性值 </el-divider>
    <el-form
      ref="addValueFromRef"
      :model="state.form"
      :rules="form2Rules"
      label-width="82px"
    >
      <el-row>
        <el-col :xs="24" :sm="12" :lg="6">
          <el-form-item label="名称" prop="name">
            <el-input v-model="state.form.name" clearable placeholder="名称" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="6">
          <el-form-item label="代码" prop="code">
            <el-input v-model="state.form.code" clearable placeholder="代码" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="6">
          <el-form-item label="缩写" prop="abbr">
            <el-input v-model="state.form.abbr" clearable placeholder="缩写" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="6">
          <el-form-item>
            <el-button type="primary" @click="addValue(addValueFromRef)">
              新增
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      ref="valuesTableRef"
      :data="newFormInline.values"
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column type="index" width="50" label="No." />
      <el-table-column property="name" label="Name">
        <template #default="scope">
          <el-input
            v-if="scope.row.isEditing"
            v-model="scope.row.name"
            size="small"
          />
          <span v-else>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column property="code" label="Code">
        <template #default="scope">
          <el-input
            v-if="scope.row.isEditing"
            v-model="scope.row.code"
            size="small"
          />
          <span v-else>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column property="abbr" label="Abbr">
        <template #default="scope">
          <el-input
            v-if="scope.row.isEditing"
            v-model="scope.row.abbr"
            size="small"
          />
          <span v-else>{{ scope.row.abbr }}</span>
        </template>
      </el-table-column>
      <el-table-column property="updatedAt" label="更新时间">
        <template #default="scope">
          <span>{{
            dayjs(scope.row.updatedAt).format("YYYY-MM-DD HH:mm:ss")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" label="Ops">
        <template #default="scope">
          <div class="flex">
            <el-button
              v-if="!scope.row.isEditing"
              size="small"
              type="warning"
              @click="handleAttributeValueEdit(scope.row)"
            >
              修改
            </el-button>
            <el-button
              v-if="scope.row.isEditing"
              size="small"
              type="primary"
              @click="handleAttributeValueSave(scope.row)"
            >
              保存
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleAttributeValueDelete(scope.row)"
            >
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
</template>
