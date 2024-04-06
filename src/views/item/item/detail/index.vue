<script setup lang="ts">
import { ref } from "vue";
import { useHook } from "../utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import MenuLine from "@iconify-icons/ri/menu-line";
import { useDetail } from "@/helpers/hooks/useDetailHook";

// import Database from "@iconify-icons/ri/database-2-line";
// import More from "@iconify-icons/ep/more-filled";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Refresh from "@iconify-icons/ep/refresh";
import Menu from "@iconify-icons/ep/menu";
import AddFill from "@iconify-icons/ri/add-circle-line";

defineOptions({
  name: "ItemDetail"
});

const { initToDetail, getParameter } = useDetail();
initToDetail("query");

const formRef = ref();
const {
  form,
  loading,
  columns,
  dataList,
  pagination,
  // buttonClass,
  onSearch,
  resetForm,
  openDialog,
  handleMenu,
  handleDelete,
  // handleDatabase,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange
} = useHook();
</script>

<template>
  <div class="main">
    <h3>{{ getParameter }}</h3>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}

.main-content {
  margin: 24px 24px 0 !important;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
