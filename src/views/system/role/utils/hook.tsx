import dayjs from "dayjs";
import editForm from "../form.vue";
// import { handleTree } from "@/utils/tree";
import { message } from "@/utils/message";
import { RoleAPI } from "@/api/system";
// import { ElMessageBox } from "element-plus";
import { usePublicThemeHooks } from "@/helpers/theme";
import { addDialog } from "@/components/ReDialog";
import type { FormItemProps } from "../utils/types";
import type { PaginationProps } from "@pureadmin/table";
import { ElMessageBox } from "element-plus";
import { transformI18n } from "@/plugins/i18n";

const { tagStyleByBool } = usePublicThemeHooks();
// import { usePublicHooks } from "../../hooks";
import {
  // getKeyList,
  deviceDetection
} from "@pureadmin/utils";
import {
  // type Ref,
  reactive,
  ref,
  onMounted,
  h
  // toRaw, watch
} from "vue";

export function useRole() {
  const form = reactive({
    code: "",
    meta: {
      enabled: undefined
    }
  });
  const curRow = ref();
  const formRef = ref();
  const dataList = ref([]);
  // const treeIds = ref([]);
  const treeData = ref([]);
  const isShow = ref(false);
  const loading = ref(true);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const columns: TableColumnList = [
    {
      label: "角色名称",
      prop: "title",
      minWidth: 120
    },
    {
      label: "角色代码",
      prop: "code",
      minWidth: 120
    },
    {
      label: "状态",
      prop: "meta.enabled",
      width: 100,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          style={tagStyleByBool.value(row.meta.enabled || false)}
        >
          {row?.meta.enabled ? "启用" : "停用"}
        </el-tag>
      )
    },
    {
      label: "创建时间",
      minWidth: 180,
      prop: "createdAt",
      formatter: ({ createdAt }) =>
        dayjs(createdAt).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 210,
      slot: "operation"
    }
  ];

  function myHandleDelete(row) {
    ElMessageBox.confirm(`请确认是否删除角色: ${row.name} `, {
      type: "warning"
    })
      .then(async () => {
        let rt = await RoleAPI.delete({ id: row._id });
        console.log(rt);
        message(`已成功删除了角色: ${row.name} `, { type: "success" });
        onSearch();
      })
      .catch(() => {});
  }

  function handleSizeChange(val: number) {
    console.log(`${val} items per page`);
    onSearch();
  }

  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`);
    onSearch();
  }

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  async function onSearch() {
    loading.value = true;
    let filters = {};
    if (form.code) {
      filters["code"] = form.code;
    }
    if (form.meta.enabled !== undefined) {
      filters["meta"] = form.meta;
    }
    const ops = {
      filters,
      currentPage: pagination.currentPage,
      pageSize: pagination.pageSize
    };
    const { data } = await RoleAPI.getPListWithFilter(ops);

    dataList.value = data.list.map(each => {
      each.title = transformI18n(`constant.roles.${each.code}`);
      return each;
    });
    pagination.total = data.total;
    pagination.pageSize = data.pageSize;
    pagination.currentPage = data.currentPage;
    loading.value = false;
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}角色`,
      props: {
        formInline: {
          code: row?.code,
          meta: {
            enabled: row?.meta?.enabled
          }
        }
      },
      width: "40%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          message(`您${title}了角色名称为${curData.code}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(async valid => {
          if (valid) {
            console.log(curData);
            // 表单规则校验通过
            if (title === "新增") {
              await RoleAPI.create(curData);
              chores();
            } else {
              await RoleAPI.update(curData);
              chores();
            }
          }
        });
      }
    });
  }

  async function toggleStatus(id: string, newValue: boolean) {
    let rt = await RoleAPI.toggleStatus({ id: id }, newValue);
    console.log(rt);
    await onSearch();
    // /** 菜单权限 */
    // async function handleMenu(row?: any) {
    //   const { id } = row;
    //   if (id) {
    //     curRow.value = row;
    //     isShow.value = true;
    //     const { data } = await getRoleMenuIds({ id });
    //     treeRef.value.setCheckedKeys(data);
    //   } else {
    //     curRow.value = null;
    //     isShow.value = false;
    //   }
    // }

    // /** 高亮当前权限选中行 */
    // function rowStyle({ row: { id } }) {
    //   return {
    //     cursor: "pointer",
    //     background: id === curRow.value?.id ? "var(--el-fill-color-light)" : ""
    //   };
    // }

    // /** 菜单权限-保存 */
    // function handleSave() {
    //   const { id, name } = curRow.value;
    //   // 根据用户 id 调用实际项目中菜单权限修改接口
    //   console.log(id, treeRef.value.getCheckedKeys());
    //   message(`角色名称为${name}的菜单权限修改成功`, {
    //     type: "success"
    //   });
  }

  /** 数据权限 可自行开发 */
  // function handleDatabase() {}

  // const onQueryChanged = (query: string) => {
  //   // treeRef.value!.filter(query);
  // };

  const filterMethod = (query: string, node) => {
    return transformI18n(node.title)!.includes(query);
  };

  onMounted(async () => {
    onSearch();
  });

  // watch(isExpandAll, val => {
  //   val
  //     ? treeRef.value.setExpandedKeys(treeIds.value)
  //     : treeRef.value.setExpandedKeys([]);
  // });

  // watch(isSelectAll, val => {
  //   val
  //     ? treeRef.value.setCheckedKeys(treeIds.value)
  //     : treeRef.value.setCheckedKeys([]);
  // });

  return {
    form,
    isShow,
    curRow,
    loading,
    columns,
    dataList,
    treeData,
    pagination,
    // buttonClass,
    onSearch,
    resetForm,
    openDialog,

    filterMethod,
    transformI18n,
    // onQueryChanged,
    // handleDatabase,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    toggleStatus,
    myHandleDelete
  };
}
