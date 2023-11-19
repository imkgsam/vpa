<script setup lang="ts">
import { type CSSProperties, computed } from "vue";
import { getAuths } from "@/router/utils";

defineOptions({
  name: "TestPage"
});

const elStyle = computed((): CSSProperties => {
  return {
    width: "85vw",
    justifyContent: "start"
  };
});
</script>

<template>
  <el-space direction="vertical" size="large">
    <h1>test page</h1>
    <el-tag :style="elStyle" size="large" effect="dark">
      当前拥有的code列表：{{ getAuths() }}
    </el-tag>

    <el-card shadow="never" :style="elStyle">
      <template #header>
        <div class="card-header">组件方式判断权限</div>
      </template>
      <Auth value="btn_add">
        <el-button type="success"> 拥有code：'btn_add' 权限可见 </el-button>
      </Auth>
      <Auth :value="['btn_edit']">
        <el-button type="primary"> 拥有code：['btn_edit'] 权限可见 </el-button>
      </Auth>
      <Auth :value="['btn_add', 'btn_edit', 'btn_delete']">
        <el-button type="danger">
          拥有code：['btn_add', 'btn_edit', 'btn_delete'] 权限可见
        </el-button>
      </Auth>
    </el-card>
  </el-space>
</template>
