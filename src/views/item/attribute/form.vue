<script setup lang="ts">
import { ref, reactive, onBeforeMount, toRaw } from "vue";
import { formRules, form2Rules } from "./utils/rule";
import { FormProps } from "./utils/types";
import { useHook } from "./utils/hook";
import { ElMessage } from "element-plus";
import { AttributeAPI } from "@/api/system";

onBeforeMount(async () => {
  console.log("in onBeforeMount of form");
  if (newFormInline.value._id) {
    console.log("requesting detail");
    let data = await AttributeAPI.detail(newFormInline.value._id);
    console.log(data.data.values);
    newFormInline.value.values = data.data.values;
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
  state.form = { ...row };
}

const form = {
  _id: null,
  name: "",
  code: "",
  abbr: "",
  attribute: null
};

const state = reactive({
  search: "",
  form: { ...form }
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
const valuesTableRef = ref();
const addValueFromRef = ref();
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
            <el-button
              :type="state.form._id ? 'warning' : 'primary'"
              @click="addValue(addValueFromRef)"
            >
              {{ state.form._id ? "修改" : "新增" }}
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
      <el-table-column property="_id" label="Id" />
      <el-table-column property="name" label="Name" />
      <el-table-column property="abbr" label="Abbreviation" />
      <el-table-column property="code" label="Code" />
      <el-table-column property="attribute" label="attr" />
      <el-table-column align="right" label="Ops">
        <template #default="scope">
          <div class="float-right">
            <el-button
              size="small"
              type="primary"
              @click="handleAttributeValueEdit(scope.row)"
            >
              修改
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
