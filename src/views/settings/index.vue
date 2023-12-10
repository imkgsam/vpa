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
  name: "AccountSetting"
});

const tabPosition = ref("left");
const section = ref("employee");

const loading = ref<boolean>(true);
// const { version } = __APP_INFO__.pkg;
const titleClass = computed(() => {
  return ["text-base", "font-medium"];
});

const { height } = useWindowSize();
const subMenus = ref(["account", "security", "billings", "company", "team"]);

setTimeout(() => {
  loading.value = !loading.value;
}, 800);
</script>

<template>
  <el-menu
    mode="vertical"
    active-text-color="#ffd04b"
    background-color="pink"
    text-color="black"
  >
    <template v-for="sub in subMenus" :key="sub">
      <el-menu-item :index="sub">{{ sub }}</el-menu-item>
    </template>
  </el-menu>
</template>
