<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import { transformI18n } from "@/plugins/i18n";
import { IconSelect } from "@/components/ReIcon";
import Segmented from "@/components/ReSegmented";
import ReAnimateSelector from "@/components/ReAnimateSelector";
import type { Route } from "@/store/modules/types";
import {
  menuTypeOptions,
  showLinkOptions,
  keepAliveOptions,
  hiddenTagOptions,
  showParentOptions,
  frameLoadingOptions
} from "./utils/enums";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    higherOptions: [],
    menuType: 0,
    _id: "",
    path: "",
    name: "",
    component: "",
    redirect: "",
    meta: {
      title: "",
      icon: "",
      extraIcon: "",
      showLink: false,
      showParent: false,
      roles: [],
      auths: [],
      keepAlive: false,
      frameSrc: "",
      frameLoading: false,
      transition: {
        name: "",
        enterTransition: "",
        leaveTransition: ""
      },
      hiddenTag: false,
      dynamicLevel: 0,
      activePath: "",
      rank: undefined
    },
    parent: ""
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
      <re-col>
        <el-form-item label="菜单类型">
          <Segmented
            v-model="newFormInline.menuType"
            :options="menuTypeOptions"
          />
        </el-form-item>
      </re-col>

      <re-col>
        <el-form-item label="上级菜单">
          <el-cascader
            v-model="newFormInline.parent"
            class="w-full"
            :options="newFormInline.higherOptions"
            :props="{
              value: 'id',
              label: 'title',
              emitPath: false,
              checkStrictly: true
            }"
            clearable
            filterable
            placeholder="请选择上级菜单"
          >
            <template #default="{ node, data }">
              <span>{{ transformI18n(data.title) }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="菜单名称" prop="title">
          <el-input
            v-model="newFormInline.meta.title"
            clearable
            placeholder="请输入菜单名称"
          />
        </el-form-item>
      </re-col>
      <re-col v-if="newFormInline.menuType !== 3" :value="12" :xs="24" :sm="24">
        <el-form-item label="路由名称" prop="name">
          <el-input
            v-model="newFormInline.name"
            clearable
            placeholder="请输入路由名称"
          />
        </el-form-item>
      </re-col>

      <re-col v-if="newFormInline.menuType !== 3" :value="12" :xs="24" :sm="24">
        <el-form-item label="路由路径" prop="path">
          <el-input
            v-model="newFormInline.path"
            clearable
            placeholder="请输入路由路径"
          />
        </el-form-item>
      </re-col>
      <re-col
        v-show="newFormInline.menuType === 0"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="组件路径">
          <el-input
            v-model="newFormInline.component"
            clearable
            placeholder="请输入组件路径"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="菜单排序">
          <el-input-number
            v-model="newFormInline.meta.rank"
            class="!w-full"
            :min="1"
            :max="9999"
            controls-position="right"
          />
        </el-form-item>
      </re-col>
      <re-col
        v-show="newFormInline.menuType === 0"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="路由重定向">
          <el-input
            v-model="newFormInline.redirect"
            clearable
            placeholder="请输入默认跳转地址"
          />
        </el-form-item>
      </re-col>

      <re-col
        v-show="newFormInline.menuType !== 3"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="菜单图标">
          <IconSelect v-model="newFormInline.meta.icon" class="w-full" />
        </el-form-item>
      </re-col>
      <re-col
        v-show="newFormInline.menuType !== 3"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="右侧图标">
          <el-input
            v-model="newFormInline.meta.extraIcon"
            clearable
            placeholder="菜单名称右侧的额外图标"
          />
        </el-form-item>
      </re-col>

      <re-col v-show="newFormInline.menuType < 2" :value="12" :xs="24" :sm="24">
        <el-form-item label="进场动画">
          <ReAnimateSelector
            v-model="newFormInline.meta.transition.enterTransition"
            placeholder="请选择页面进场加载动画"
          />
        </el-form-item>
      </re-col>
      <re-col v-show="newFormInline.menuType < 2" :value="12" :xs="24" :sm="24">
        <el-form-item label="离场动画">
          <ReAnimateSelector
            v-model="newFormInline.meta.transition.leaveTransition"
            placeholder="请选择页面离场加载动画"
          />
        </el-form-item>
      </re-col>

      <re-col
        v-show="newFormInline.menuType === 0"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="菜单激活">
          <el-input
            v-model="newFormInline.meta.activePath"
            clearable
            placeholder="请输入需要激活的菜单"
          />
        </el-form-item>
      </re-col>
      <re-col v-if="newFormInline.menuType === 3" :value="12" :xs="24" :sm="24">
        <!-- 按钮级别权限设置 -->
        <el-form-item label="权限标识" prop="auths">
          <!-- <ul>
            <li v-for="auth in auths">
              <span></span>
            </li>
          </ul>
          <el-input
            v-model="newFormInline.meta.auths"
            clearable
            placeholder="请输入权限标识"
          /> -->
        </el-form-item>
      </re-col>

      <re-col
        v-show="newFormInline.menuType === 1"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <!-- iframe -->
        <el-form-item label="链接地址">
          <el-input
            v-model="newFormInline.meta.frameSrc"
            clearable
            placeholder="请输入 iframe 链接地址"
          />
        </el-form-item>
      </re-col>
      <re-col v-if="newFormInline.menuType === 1" :value="12" :xs="24" :sm="24">
        <el-form-item label="加载动画">
          <Segmented
            :modelValue="newFormInline.meta.frameLoading ? 0 : 1"
            :options="frameLoadingOptions"
            @change="
              ({ option: { value } }) => {
                newFormInline.meta.frameLoading = value;
              }
            "
          />
        </el-form-item>
      </re-col>

      <re-col v-show="newFormInline.menuType < 2" :value="12" :xs="24" :sm="24">
        <el-form-item label="缓存页面">
          <Segmented
            :modelValue="newFormInline.meta.keepAlive ? 0 : 1"
            :options="keepAliveOptions"
            @change="
              ({ option: { value } }) => {
                newFormInline.meta.keepAlive = value;
              }
            "
          />
        </el-form-item>
      </re-col>
      <re-col v-show="newFormInline.menuType < 2" :value="12" :xs="24" :sm="24">
        <el-form-item label="标签页">
          <Segmented
            :modelValue="newFormInline.meta.hiddenTag ? 1 : 0"
            :options="hiddenTagOptions"
            @change="
              ({ option: { value } }) => {
                newFormInline.meta.hiddenTag = value;
              }
            "
          />
        </el-form-item>
      </re-col>

      <re-col
        v-show="newFormInline.menuType !== 3"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="菜单">
          <Segmented
            :modelValue="newFormInline.meta.showLink ? 0 : 1"
            :options="showLinkOptions"
            @change="
              ({ option: { value } }) => {
                newFormInline.meta.showLink = value;
              }
            "
          />
        </el-form-item>
      </re-col>
      <re-col
        v-show="newFormInline.menuType !== 3"
        :value="8"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="父级菜单">
          <Segmented
            :modelValue="newFormInline.meta.showParent ? 0 : 1"
            :options="showParentOptions"
            @change="
              ({ option: { value } }) => {
                newFormInline.meta.showParent = value;
              }
            "
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
