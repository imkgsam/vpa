<script setup lang="ts">
import dayjs from "dayjs";
import MdEditor from "md-editor-v3";
import TypeIt from "@/components/ReTypeit";
import { useWindowSize } from "@vueuse/core";
import { ref, computed, markRaw } from "vue";
import { randomColor } from "@pureadmin/utils";
import Info from "@iconify-icons/ri/information-line";
import Overview from "./components/overview.vue";
import Mainbody from "./components/mainbody.vue";

defineOptions({
  name: "Profile"
});

const tabPosition = ref("left");
const section = ref("employee");

const loading = ref<boolean>(true);
// const { version } = __APP_INFO__.pkg;
const titleClass = computed(() => {
  return ["text-base", "font-medium"];
});

const { height } = useWindowSize();

setTimeout(() => {
  loading.value = !loading.value;
}, 800);
</script>

<template>
  <el-row :gutter="5" class="p-3">
    <el-col v-motion :xs="24" :sm="9" :md="8" :lg="6" :xl="4">
      <Overview />
    </el-col>
    <el-col
      v-motion
      :xs="24"
      :sm="15"
      :md="16"
      :lg="18"
      :xl="20"
      class="mt-2 md:m-0"
    >
      <Mainbody />
    </el-col>
  </el-row>
</template>

<!-- <style lang="scss" scoped>
:deep(.el-timeline-item) {
  margin: 6px 0 0 6px;
}

.main-content {
  margin: 20px 20px 0 !important;
}
</style> -->
