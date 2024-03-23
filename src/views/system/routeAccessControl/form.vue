<script setup lang="ts">
import { ref, onMounted } from "vue";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import { transformI18n } from "@/plugins/i18n";
import { RouteAPI } from "@/api/system";
import { RouteAuth } from "@/store/modules/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    userList: [],
    roleList: [],
    routeTree: [],

    auths_options: [],

    _id: null,
    user: null,
    role: null,
    route: null,
    auths: [],
    meta: {
      enabled: false
    }
  })
});

onMounted(async () => {
  console.log(" in form onmounted");
  console.log(props.formInline);
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

async function handleRouteSelect(value) {
  console.log("in handleRouteSelect ", value);
  if (value) {
    let rt = await RouteAPI.Route.get_auths_options(value);
    if (rt && rt.data) newFormInline.value.auths_options = rt.data;
  }
}

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
    <el-form-item label="路由" prop="route">
      <el-cascader
        v-model="newFormInline.route"
        class="w-full"
        :options="newFormInline.routeTree"
        :disabled="!!newFormInline._id"
        :props="{
          value: '_id',
          label: 'title',
          emitPath: false,
          checkStrictly: true
        }"
        clearable
        filterable
        placeholder="请选择上级菜单"
        @change="handleRouteSelect"
      >
        <template #default="{ node, data }">
          <span>{{ transformI18n(data.meta.title) }}</span>
          <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
        </template>
      </el-cascader>
    </el-form-item>

    <el-form-item label="用户" prop="user">
      <el-select
        v-model="newFormInline.user"
        clearable
        placeholder="请选择用户"
        style="width: 240px"
      >
        <el-option
          v-for="item in newFormInline.userList"
          :key="item._id"
          :label="item.accountName"
          :value="item._id"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="角色" prop="role">
      <el-select
        v-model="newFormInline.role"
        clearable
        placeholder="请选择角色"
        style="width: 240px"
      >
        <el-option
          v-for="item in newFormInline.roleList"
          :key="item._id"
          :label="item.code"
          :value="item._id"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="按钮权限" prop="auths">
      <el-select
        v-model="newFormInline.auths"
        clearable
        multiple
        placeholder="请选择按钮权限"
        style="width: 240px"
      >
        <el-option
          v-for="item in newFormInline.auths_options"
          :key="item._id"
          :label="item.name"
          :value="item._id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="状态" prop="meta.enabled">
      <el-switch
        v-model="newFormInline.meta.enabled"
        size="large"
        active-text="启用"
        inactive-text="停用"
      />
    </el-form-item>
  </el-form>
</template>
