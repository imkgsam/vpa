import dayjs from "dayjs";
import editForm from "../form.vue";
import variantForm from "../components/variantForm.vue";
import { message } from "@/utils/message";
import { ItemAPI } from "@/api/system";
// import { ElMessageBox } from "element-plus";
import { usePublicThemeHooks } from "@/helpers/theme";
import { addDialog } from "@/components/ReDialog";
import type { FormItemProps, VariantFormProps } from "../utils/types";
import type { PaginationProps } from "@pureadmin/table";
import { reactive, ref, onMounted, h } from "vue";
import { usePublicStoreHook } from "@/store/modules/public";
import { onBeforeMount } from "vue";
import { storeToRefs } from "pinia";
import { usePublicAppVariableHooks } from "@/helpers/appVariables";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";

import { useRouter, useRoute } from "vue-router";

const { ItemTypeOptions } = usePublicAppVariableHooks();
const { tagStyleByBool } = usePublicThemeHooks();

const {
  categoryOptionsTree: categoriesOptions,
  publicAttributes: attributeOptions,
  allProducibleItems
} = storeToRefs(usePublicStoreHook());

export function useHook() {
  const router = useRouter();
  const route = useRoute();
  onBeforeMount(() => {
    usePublicStoreHook().getAllPublicCategories(false);
    usePublicStoreHook().getAllPublicAttributes(false);
    usePublicStoreHook().getAllPublicItems(false);
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
      label: "内部别称",
      prop: "alias",
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

  async function toggleStatus(id: string, newValue: boolean) {
    let rt = await ItemAPI.toggleStatus({ id: id }, newValue);
    console.log(rt);
    await onSearch();
  }

  function handleItemSubmit(row, ref, ops) {
    console.log("in handleItemSubmit", row);
    console.log(ref);
    console.log(ops);
    const FormRef = ref;
    const curData = row as FormItemProps;
    function nextStep(success: boolean, errorMessage?: string) {
      message(success ? `您的操作已成功` : errorMessage, {
        type: success ? "success" : "error"
      });
      if (success) {
        useMultiTagsStoreHook().handleTags("splice", route.path);
        router.push("/item/item/index");
      }
    }
    FormRef.validate(async valid => {
      console.log("curData", curData);
      delete curData?.meta?.attributeTags;
      if (valid) {
        let res = null;
        if (ops === "update") {
          res = await ItemAPI.update({ ...curData });
        } else if (ops === "create") {
          res = await ItemAPI.create({ ...curData });
        } else {
          console.log("not implement");
        }
        nextStep(res?.statusCode === "10000", res?.message);
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
          alias: row?.alias,
          category: row?.category?._id,
          etype: row?.etype,
          meta: {
            enabled: row?.meta?.enabled,
            canBeStocked: row?.meta?.canBeStocked,
            canBeSold: row?.meta?.canBeSold,
            canBePurchased: row?.meta?.canBePurchased,
            canBeProduced: row?.meta?.canBeProduced,
            canBeRented: row?.meta?.canBeRented,
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

  function openVariantDialog(row?: VariantFormProps) {
    console.log("in openVariantDialog", row);
    addDialog({
      title: `查看产品变体`,
      props: {
        data: {
          _id: row?._id
        }
      },
      width: "40%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(variantForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        FormRef.validate(valid => {
          if (valid) {
            console.log("curData", curData);
          }
        });
      }
    });
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
    handleItemSubmit,
    openVariantDialog,
    allProducibleItems,
    toggleStatus
  };
}
