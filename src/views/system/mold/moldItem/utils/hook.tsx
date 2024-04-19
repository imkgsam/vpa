// import dayjs from "dayjs";
import { onBeforeMount } from "vue";
import editForm from "../form.vue";
import { message } from "@/utils/message";
import { MoldAPI } from "@/api/system";
// import { ElMessageBox } from "element-plus";
import { usePublicThemeHooks } from "@/helpers/theme";
import { addDialog } from "@/components/ReDialog";
import type { FormItemProps } from "../utils/types";
import type { PaginationProps } from "@pureadmin/table";
import { reactive, ref, onMounted, h } from "vue";
import { ElMessageBox } from "element-plus";
import { transformI18n } from "@/plugins/i18n";
import { usePublicSharedFunctionsHooks } from "@/helpers/sharedFunctions";
import { usePublicStoreHook } from "@/store/modules/public";
import { storeToRefs } from "pinia";

const { formatBarcodeString } = usePublicSharedFunctionsHooks();

const { publicSuppliers: supplierOptions, allMoldItems } =
  storeToRefs(usePublicStoreHook());

const { tagStyleByBool } = usePublicThemeHooks();

export function useHook() {
  onBeforeMount(() => {
    usePublicStoreHook().getAllPublicItems(false);
    usePublicStoreHook().getAllPublicSuppliers(false);
  });

  const form = reactive({
    code: "",
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
      label: "产品SPU",
      prop: "product",
      minWidth: 100
    },
    {
      label: "模具批次",
      prop: "meta.batch",
      minWidth: 100
    },
    {
      label: "识别码",
      prop: "barcode",
      width: 100,
      formatter: ({ barcode }) => formatBarcodeString(barcode)
    },
    {
      label: "可选属性",
      minWidth: 180,
      prop: "attributes"
    },
    {
      label: "模具类型",
      prop: "mtype",
      minWidth: 100,
      formatter: ({ mtype }) => transformI18n(`constant.moldType.${mtype}`)
    },
    {
      label: "最高",
      prop: "maxGroutingTimes",
      sortable: true
    },
    {
      label: "初始",
      prop: "initialGroutingTimes",
      sortable: true
    },
    {
      label: "预警",
      prop: "warningThreadhold",
      sortable: true
    },
    {
      label: "累计",
      prop: "cumulativeGroutingTimes",
      sortable: true
    },
    {
      label: "剩余",
      prop: "remaining",
      sortable: true,
      formatter: ({
        maxGroutingTimes,
        initialGroutingTimes,
        cumulativeGroutingTimes
      }) =>
        `${maxGroutingTimes - initialGroutingTimes - cumulativeGroutingTimes}`
    },
    {
      label: "所属模组",
      prop: "group.moldGroup",
      sortable: true,
      formatter: ({ row }) =>
        row?.group.moldGroup ? row?.group.moldGroup.name : "-"
    },
    {
      label: "排位",
      prop: "group.index",
      formatter: ({ row }) => (row?.group.index ? row?.group.index : "-")
    },
    {
      label: "所在地点",
      prop: "location",
      minWidth: 120,
      formatter: ({ row }) => row?.location.name
    },
    {
      label: "状态",
      prop: "meta",
      width: 100,
      cellRenderer: ({ row }) => (
        <>
          <el-tag style={tagStyleByBool.value(row.meta.enabled || false)}>
            {row?.meta.enabled ? "启用" : "停用"}
          </el-tag>
          <el-tag style={tagStyleByBool.value(row.meta?.inUse || false)}>
            {row?.meta?.inUse ? "使用中" : "闲置中"}
          </el-tag>
        </>
      )
    },
    {
      label: "操作",
      fixed: "right",
      width: 150,
      slot: "operation"
    }
  ];

  function myHandleDelete(row) {
    ElMessageBox.confirm(`请确认是否删除角色: ${row.name} `, {
      type: "warning"
    })
      .then(async () => {
        let rt = await MoldAPI.MoldItem.delete({ id: row._id });
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
    const { data } = await MoldAPI.MoldItem.getPListWithFilter(ops);
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
      title: `${title}角色`,
      props: {
        formInline: {
          code: row?.code ?? "",
          meta: {
            enabled: row?.meta.enabled || false
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
              await MoldAPI.MoldItem.create({
                code: curData.code,
                meta: { enabled: curData.meta.enabled }
              });
              chores();
            } else {
              await MoldAPI.MoldItem.update({
                code: curData.code,
                _id: curData._id,
                meta: { enabled: curData.meta.enabled }
              });
              chores();
            }
          }
        });
      }
    });
  }

  async function toggleStatus(id: string, newValue: boolean) {
    let rt = await MoldAPI.MoldItem.toggleStatus({ id: id }, newValue);
    console.log(rt);
    await onSearch();
  }

  /** 数据权限 可自行开发 */
  // function handleDatabase() {}

  onMounted(() => {
    onSearch();
  });

  return {
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

    supplierOptions,
    allMoldItems
  };
}
