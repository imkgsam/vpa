<script setup lang="ts">
import { ref } from "vue";
import tree from "./tree.vue";
import { useUser } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import MenuLine from "@iconify-icons/ri/menu-line";

import Upload from "@iconify-icons/ri/upload-line";
import Role from "@iconify-icons/ri/admin-line";
import Password from "@iconify-icons/ri/lock-password-line";
import More from "@iconify-icons/ep/more-filled";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Refresh from "@iconify-icons/ep/refresh";
import AddFill from "@iconify-icons/ri/add-circle-line";

defineOptions({
  name: "SystemUser"
});

const treeRef = ref();
const formRef = ref();
const tableRef = ref();

const detailContent = ref();
const detailDrawerVisiable = ref(false);

function detailClicked(row) {
  detailDrawerVisiable.value = true;
  detailContent.value = row;
}

const {
  form,
  loading,
  columns,
  dataList,
  treeData,
  treeLoading,
  selectedNum,
  pagination,
  buttonClass,
  onSearch,
  resetForm,
  onbatchDel,
  openDialog,
  // onTreeSelect,
  handleUpdate,
  handleDelete,
  handleUpload,
  handleReset,
  handleRole,
  handleSizeChange,
  onSelectionCancel,
  handleCurrentChange,
  handleSelectionChange,
  myHandleDelete,

  toggleStatus
} = useUser(tableRef);
</script>

<template>
  <div class="main">
    <!-- 左边drawer -->
    <el-drawer v-model="detailDrawerVisiable" direction="rtl">
      <template #header>
        <h4>成员详情信息</h4>
      </template>
      <template #default>
        <div>{{ detailContent }}</div>
      </template>
    </el-drawer>

    <!-- 顶部搜索form  -->
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
    >
      <!-- <el-form-item label="用户名称：" prop="accountName">
        <el-input
          v-model="form.accountName"
          placeholder="请输入用户名称"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item label="手机号码：" prop="phone">
        <el-input
          v-model="form.phone"
          placeholder="请输入手机号码"
          clearable
          class="!w-[180px]"
        />
      </el-form-item> -->
      <el-form-item label="启用状态" prop="meta.enabled">
        <el-select
          v-model="form.meta.enabled"
          placeholder="请选择"
          clearable
          class="!w-[180px]"
        >
          <el-option label="已启用" value="true" />
          <el-option label="已停用" value="false" />
        </el-select>
      </el-form-item>
      <el-form-item label="认证状态" prop="meta.verified">
        <el-select
          v-model="form.meta.verified"
          placeholder="请选择"
          clearable
          class="!w-[180px]"
        >
          <el-option label="已认证" value="true" />
          <el-option label="未认证" value="false" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon('ri:search-line')"
          :loading="loading"
          @click="onSearch"
        >
          搜索
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 数据列表 -->
    <PureTableBar title="成员管理" :columns="columns" @refresh="onSearch">
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="openDialog()"
        >
          新增用户
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <div
          v-if="selectedNum > 0"
          v-motion-fade
          class="bg-[var(--el-fill-color-light)] w-full h-[46px] mb-2 pl-4 flex items-center"
        >
          <div class="flex-auto">
            <span
              style="font-size: var(--el-font-size-base)"
              class="text-[rgba(42,46,54,0.5)] dark:text-[rgba(220,220,242,0.5)]"
            >
              已选 {{ selectedNum }} 项
            </span>
            <el-button type="primary" text @click="onSelectionCancel">
              取消选择
            </el-button>
          </div>
          <el-popconfirm title="是否确认删除?" @confirm="onbatchDel">
            <template #reference>
              <el-button type="danger" text class="mr-1"> 批量删除 </el-button>
            </template>
          </el-popconfirm>
        </div>
        <pure-table
          ref="tableRef"
          row-key="id"
          adaptive
          :adaptiveConfig="{ offsetBottom: 108 }"
          align-whole="center"
          table-layout="auto"
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="pagination"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          @selection-change="handleSelectionChange"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #operation="{ row }">
            <el-button text @click="detailClicked(row)"> 详情 </el-button>
            <el-dropdown trigger="click" class="!align-middle">
              <el-icon>
                <IconifyIconOffline :icon="MenuLine" />
              </el-icon>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <el-button
                      class="reset-margin"
                      link
                      type="warning"
                      :size="size"
                      :icon="useRenderIcon(EditPen)"
                      @click="openDialog('修改', row)"
                    >
                      修改
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button
                      class="reset-margin"
                      link
                      :type="row?.meta.enabled ? 'danger' : 'success'"
                      :size="size"
                      :icon="useRenderIcon(EditPen)"
                      @click="toggleStatus(row._id, !row.meta.enabled)"
                    >
                      {{ row?.meta.enabled ? "停用" : "启用" }}
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button
                      class="reset-margin"
                      link
                      type="danger"
                      :size="size"
                      :icon="useRenderIcon(Delete)"
                      @click="myHandleDelete(row)"
                    >
                      删除
                    </el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}

:deep(.el-button:focus-visible) {
  outline: none;
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
