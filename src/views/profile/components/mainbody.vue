<script setup lang="ts">
import TypeIt from "@/components/ReTypeit";
import { useWindowSize } from "@vueuse/core";
import { ref, computed, markRaw } from "vue";
import { randomColor } from "@pureadmin/utils";
import Info from "@iconify-icons/ri/information-line";
import { useTranslationLang } from "@/layout/hooks/useTranslationLang";
import Tab1 from "./tab1.vue";

const tabPosition = ref("left");
const section = ref("employee");
const activeTab = ref("overview");
const { t } = useTranslationLang();
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
  <div class="">
    <el-tabs v-model="activeTab" type="border-card">
      <el-tab-pane name="overview" :label="t('buttons.hsOverview')">
        <Tab1 />
      </el-tab-pane>
      <el-tab-pane name="overview1" :label="t('buttons.hsOverview')" />
      <el-tab-pane name="overview2" :label="t('buttons.hsOverview')" />
      <el-tab-pane name="overview3" :label="t('buttons.hsOverview')" />
    </el-tabs>
  </div>
</template>
