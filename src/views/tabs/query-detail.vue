<script setup lang="ts">
import { useDetail } from "./hooks";

defineOptions({
  name: "TabQueryDetail"
});

const { initToDetail, getParameter } = useDetail();
initToDetail("query");
</script>

<template>
  <div>
    <p>当前页面参数为：{{ getParameter }}</p>
  </div>
</template>
