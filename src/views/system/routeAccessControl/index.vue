<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useLinkHook } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import MenuLine from "@iconify-icons/ri/menu-line";
import { transformI18n } from "@/plugins/i18n";

// import Database from "@iconify-icons/ri/database-2-line";
// import More from "@iconify-icons/ep/more-filled";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Refresh from "@iconify-icons/ep/refresh";
import Menu from "@iconify-icons/ep/menu";
import AddFill from "@iconify-icons/ri/add-circle-line";

defineOptions({
  name: "SystemRole"
});

const formRef = ref();
const {
  userList,
  roleList,
  routeList,

  form,
  loading,
  columns,
  dataList,
  pagination,
  // buttonClass,
  onSearch,
  resetForm,
  openDialog,
  // handleDatabase,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  toggleStatus,
  myHandleDelete,

  initToDetail,
  getParameter
} = useLinkHook();

initToDetail("query");

onMounted(() => {
  // console.log('in onMounted', getParameter)
});
</script>

<template>
  <div class="main">
    <!-- search form  -->
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
    >
      <el-form-item label="用户" prop="user">
        <el-select
          v-model="form.user"
          clearable
          placeholder="Select"
          style="width: 180px"
        >
          <el-option
            v-for="item in userList"
            :key="item._id"
            :label="item.accountName"
            :value="item._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select
          v-model="form.role"
          clearable
          placeholder="Select"
          style="width: 180px"
        >
          <el-option
            v-for="item in roleList"
            :key="item._id"
            :label="item.code"
            :value="item._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="路由" prop="route">
        <el-cascader
          v-model="form.route"
          class="w-full"
          :options="routeList"
          :props="{
            value: '_id',
            label: 'title',
            emitPath: false,
            checkStrictly: true
          }"
          clearable
          filterable
          placeholder="请选择上级菜单"
        >
          <template #default="{ node, data }">
            <span>{{ transformI18n(data.meta.title) }}</span>
            <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
          </template>
        </el-cascader>
      </el-form-item>
      <el-form-item label="状态：" prop="meta.enabled">
        <el-select
          v-model="form.meta.enabled"
          placeholder="请选择状态"
          clearable
          class="!w-[180px]"
        >
          <el-option label="已启用" value="true" />
          <el-option label="已停用" value="false" />
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

    <!-- table  -->
    <PureTableBar title="权限控制" :columns="columns" @refresh="onSearch">
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="openDialog()"
        >
          新增
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="loading"
          :size="size"
          adaptive
          :adaptiveConfig="{ offsetBottom: 108 }"
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
          <!-- <template #operation="{ row }">
            <el-button class="reset-margin" link type="primary" :size="size" :icon="useRenderIcon(EditPen)"
              @click="openDialog('修改', row)">
              修改
            </el-button>
            <el-button class="reset-margin" link type="primary" :size="size" :icon="useRenderIcon(Menu)"
              @click="handleMenu">
              菜单权限
            </el-button>
            <el-popconfirm :title="`是否确认删除角色名称为${row.name}的这条数据`" @confirm="handleDelete(row)">
              <template #reference>
                <el-button class="reset-margin" link type="primary" :size="size" :icon="useRenderIcon(Delete)">
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template> -->
        </pure-table>
      </template>
    </PureTableBar>
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
