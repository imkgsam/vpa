import dayjs from "dayjs";
import editForm from "../form.vue";
import { message } from "@/utils/message";
import { ItemAPI } from "@/api/system";
// import { ElMessageBox } from "element-plus";
import { usePublicThemeHooks } from "@/helpers/theme";
import { addDialog } from "@/components/ReDialog";
import type { FormItemProps } from "../utils/types";
import type { PaginationProps } from "@pureadmin/table";
import { reactive, ref, onMounted, h } from "vue";
import { usePublicStoreHook } from "@/store/modules/public";
import { onBeforeMount } from "vue";
import { storeToRefs } from "pinia";
import { usePublicAppVariableHooks } from "@/helpers/appVariables";
import { useDetail } from "@/helpers/hooks/useDetailHook";

const { ItemTypeOptions } = usePublicAppVariableHooks();
const { tagStyleByBool } = usePublicThemeHooks();

const {
  categoryOptionsTree: categoriesOptions,
  publicAttributes: attributeOptions
} = storeToRefs(usePublicStoreHook());

// const { closeTagAndGoTo } = useDetail()

export function useHook() {
  onBeforeMount(() => {
    usePublicStoreHook().getAllPublicCategories(false);
    usePublicStoreHook().getAllPublicAttributes(false);
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
      label: "产品名称",
      prop: "code",
      minWidth: 120
    },
    {
      label: "产品状态",
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
      formatter: ({ createTime }) =>
        dayjs(createTime).format("YYYY-MM-DD HH:mm")
    },
    {
      label: "操作",
      fixed: "right",
      width: 210,
      slot: "operation"
    }
  ];

  function handleDelete(row) {
    message(`您删除了产品名称为${row.code}的这条数据`, { type: "success" });
    onSearch();
  }

  function handleSizeChange(val: number) {
    console.log(`${val} items per page`);
    onSearch();
  }

  function handleDetailSubmit(row, ref, ops) {
    console.log("in handleDetailSubmit", row);
    console.log(ref);
    console.log(ops);
    const FormRef = ref;
    const curData = row as FormItemProps;
    FormRef.validate(async valid => {
      console.log("curData", curData);
      delete curData?.meta?.attributeTags;
      if (valid) {
        console.log(" valid");
        if (ops === "update") {
          await ItemAPI.update({ ...curData });
        } else if (ops === "create") {
          await ItemAPI.create({ ...curData });
        } else {
          console.log("not implement");
        }
        useDetail().closeTagAndGoTo("/item/item/index");
        onSearch();
      } else {
        console.log(" invalid");
      }
    });
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
    const { data } = await ItemAPI.getPListWithFilter(ops);
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
      title: `${title}产品`,
      props: {
        formInline: {
          _id: row?._id,
          code: row?.code,
          category: row?.category?._id,
          etype: row?.etype,
          meta: {
            enabled: row?.meta?.enabled,
            canBeStocked: row?.meta?.canBeStocked,
            canBeSold: row?.meta?.canBeSold,
            canBePurchased: row?.meta?.canBePurchased,
            canBenProduced: row?.meta?.canBenProduced,
            canBenRented: row?.meta?.canBenRented,
            hasVariants: row?.meta?.hasVariants,
            isVariantOf: row?.meta?.isVariantOf?._id,
            attributeTags: row?.meta?.attributeTags
          },
          attributes: row?.attributes
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
          message(`您${title}了产品名称为${curData.code}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(valid => {
          if (valid) {
            console.log("curData", curData);
            // 表单规则校验通过
            if (title === "新增") {
              // 实际开发先调用新增接口，再进行下面操作
              chores();
            } else {
              // 实际开发先调用修改接口，再进行下面操作
              chores();
            }
          }
        });
      }
    });
  }

  /** 菜单权限 */
  function handleMenu() {
    message("等菜单管理页面开发后完善");
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
    handleMenu,
    handleDelete,
    // handleDatabase,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,

    categoriesOptions,
    ItemTypeOptions,
    attributeOptions,
    usePublicStoreHook,
    handleDetailSubmit
  };
}
