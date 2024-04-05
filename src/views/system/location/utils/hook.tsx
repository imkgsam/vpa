// import dayjs from "dayjs";
import editForm from "../form.vue";
import { handleTree } from "@/utils/tree";
import { message } from "@/utils/message";
import { LocationAPI } from "@/api/system";
import { usePublicThemeHooks } from "@/helpers/theme";
import { addDialog } from "@/components/ReDialog";
import { reactive, ref, onMounted, h } from "vue";
import type { FormItemProps } from "../utils/types";
import { cloneDeep, isAllEmpty } from "@pureadmin/utils";
import { ElMessageBox } from "element-plus";
import { usePublicSharedFunctionsHooks } from "@/helpers/sharedFunctions";
import { transformI18n } from "@/plugins/i18n";
import { usePublicAppVariableHooks } from "@/helpers/appVariables";
import { usePublicStoreHook } from "@/store/modules/public";
import { storeToRefs } from "pinia";
import { onBeforeMount } from "vue";

const { publicCompanies: companyOptions } = storeToRefs(usePublicStoreHook());

const { LocationTypeOptions } = usePublicAppVariableHooks();

export function useHook() {
  onBeforeMount(async () => {
    await usePublicStoreHook().getAllPublicCompanies(false);
  });

  const form = reactive({
    name: "",
    ltypes: [],
    company: null,
    meta: {
      enabled: null
    }
  });

  const { formatHigherDeptOptions } = usePublicSharedFunctionsHooks();

  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  const { tagStyleByBool } = usePublicThemeHooks();

  const columns: TableColumnList = [
    {
      label: "名称",
      prop: "name",
      align: "left"
    },
    {
      label: "Path",
      prop: "path",
      align: "left"
    },
    {
      label: "类型",
      prop: "ltype",
      formatter: ({ ltype }) => transformI18n(`constant.location.${ltype}`)
    },
    {
      label: "所属公司",
      prop: "company",
      formatter: ({ company }) => company.name
    },
    {
      label: "状态",
      prop: "meta.enabled",
      // width: 100,
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
      label: "操作",
      fixed: "right",
      width: 210,
      slot: "operation"
    }
  ];

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  }

  async function onSearch() {
    loading.value = true;
    const { data } = await LocationAPI.getList(); // 这里是返回一维数组结构，前端自行处理成树结构，返回格式要求：唯一id加父节点parentId，parentId取父节点id
    let newData = data;
    if (!isAllEmpty(form.name)) {
      newData = newData.filter(item => item.name.includes(form.name));
    }
    if (!isAllEmpty(form.meta.enabled)) {
      newData = newData.filter(item => item.meta.enabled === form.meta.enabled);
    }
    if (form.ltypes.length) {
      newData = newData.filter(item => form.ltypes.includes(item.ltype));
    }
    if (!isAllEmpty(form.company)) {
      newData = newData.filter(item => item.company?._id === form.company);
    }
    dataList.value = handleTree(
      newData,
      "_id",
      "parent",
      "children",
      "name",
      "path",
      "-"
    ); // 处理成树结构
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  async function toggleStatus(id: string, newValue: boolean) {
    let rt = await LocationAPI.toggleStatus({ id: id }, newValue);
    console.log(rt);
    await onSearch();
  }

  function openDialog(title = "新增", row?: FormItemProps) {
    console.log(title, row?._id);
    addDialog({
      title: `${title}地点`,
      props: {
        formInline: {
          title,
          _id: row?._id,
          higherDeptOptions: formatHigherDeptOptions(
            cloneDeep(dataList.value.filter(each => each._id !== row?._id))
          ),
          parent: row?.parent,
          name: row?.name,
          ltype: row?.ltype,
          company: row?.company?._id,
          meta: {
            enabled: row?.meta?.enabled
          }
        }
      },
      width: "45%",
      draggable: false,
      fullscreenIcon: false,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          message(`您${title}了地点名称为${curData.name}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        delete curData.title;
        delete curData.higherDeptOptions;
        FormRef.validate(async valid => {
          if (valid) {
            console.log(curData);
            // 表单规则校验通过
            if (title === "新增") {
              await LocationAPI.create({ ...curData });
              chores();
            } else {
              await LocationAPI.update({ ...curData });
              chores();
            }
          }
        });
      }
    });
  }

  function myHandleDelete(row) {
    ElMessageBox.confirm(`请确认是否删除地点: ${row.name} `, {
      type: "warning"
    })
      .then(async () => {
        let rt = await LocationAPI.delete({ id: row._id });
        console.log(rt);
        message(`已成功删除了地点: ${row.name} `, { type: "success" });
        onSearch();
      })
      .catch(() => {});
  }

  onMounted(() => {
    onSearch();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    onSearch,
    resetForm,
    openDialog,
    myHandleDelete,
    handleSelectionChange,
    toggleStatus,
    LocationTypeOptions,
    companyOptions
  };
}
