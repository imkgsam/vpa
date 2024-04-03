import dayjs from "dayjs";
import { onBeforeMount } from "vue";
import editForm from "../form.vue";
import { message } from "@/utils/message";
import { BarcodeAPI } from "@/api/system";
// import { ElMessageBox } from "element-plus";
import { usePublicThemeHooks } from "@/helpers/theme";
import { addDialog } from "@/components/ReDialog";
import type { FormItemProps } from "../utils/types";
import type { PaginationProps } from "@pureadmin/table";
import { reactive, ref, onMounted, h } from "vue";
import { ElMessageBox } from "element-plus";
// import { transformI18n } from "@/plugins/i18n";
// import { usePublicConstantHooks } from "@/helpers/constant";
// import { usePublicAppVariableHooks } from "@/helpers/appVariables";
// import { usePublicSharedFunctionsHooks } from "@/helpers/sharedFunctions";
import { storeToRefs } from "pinia";
import { usePublicStoreHook } from "@/store/modules/public";

const {
  publicWorkers: workerOptions,
  publicEmployees: employeeOptions,
  // publicDepartments: departmentOptions,
  departmentOptionsTree
} = storeToRefs(usePublicStoreHook());

const { tagStyleByBool } = usePublicThemeHooks();

export function useRole() {
  onBeforeMount(() => {
    usePublicStoreHook().getAllPublicEmployees(false);
  });

  const form = reactive({
    name: "",
    workers: [],
    department: undefined,
    manager: undefined,
    meta: {
      enabled: undefined
    }
  });
  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  // const switchLoadMap = ref({});
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const columns: TableColumnList = [
    {
      label: "模组名称",
      prop: "name",
      minWidth: 120
    },
    {
      label: "操作工人",
      prop: "workers",
      minWidth: 120
    },
    {
      label: "所属部门",
      prop: "department",
      minWidth: 120
    },
    {
      label: "管理者",
      prop: "manager",
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
    ElMessageBox.confirm(`请确认是否删除模组: ${row.name} `, {
      type: "warning"
    })
      .then(async () => {
        let rt = await BarcodeAPI.BarcodeType.delete({ id: row._id });
        console.log(rt);
        message(`已成功删除了模组: ${row.name} `, { type: "success" });
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
    const { data } = await BarcodeAPI.BarcodeType.getPListWithFilter(ops);

    dataList.value = data.list;
    pagination.total = data.total;
    pagination.pageSize = data.pageSize;
    pagination.currentPage = data.currentPage;
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}模组`,
      props: {
        formInline: {
          _id: row?._id,
          code: row?.code,
          startsWith: row?.startsWith,
          remark: row?.remark,
          length: row?.length || 10,
          meta: {
            enabled: row?.meta?.enabled
          }
        }
      },
      width: "40%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          message(`您${title}了模组名称为${curData.code}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(async valid => {
          if (valid) {
            // 表单规则校验通过
            if (title === "新增") {
              await BarcodeAPI.BarcodeType.create(curData);
              chores();
            } else {
              await BarcodeAPI.BarcodeType.update(curData);
              chores();
            }
          }
        });
      }
    });
  }

  async function toggleStatus(id: string, newValue: boolean) {
    let rt = await BarcodeAPI.BarcodeType.toggleStatus({ id: id }, newValue);
    console.log(rt);
    await onSearch();
  }

  /** 数据权限 可自行开发 */
  // function handleDatabase() {}

  onMounted(() => {
    onSearch();
  });

  return {
    workerOptions,
    departmentOptionsTree,
    employeeOptions,

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
    myHandleDelete
  };
}
