<script setup>
defineOptions({
  name: "DescriptionsTooltip"
});
const props = defineProps(["value"]);
</script>

<template>
  <el-tooltip :content="value" placement="bottom-start">
    <span ref="content" @mouseover="true">{{ value }}</span>
  </el-tooltip>
</template>
