import dayjs from "dayjs";
import editForm from "../form.vue";
import { message } from "@/utils/message";
import { AttributeAPI } from "@/api/system";
// import { ElMessageBox } from "element-plus";
import { usePublicHooks } from "../../hooks";
import { addDialog } from "@/components/ReDialog";
import type { FormItemProps } from "../utils/types";
import type { PaginationProps } from "@pureadmin/table";
import { reactive, ref, onMounted, h } from "vue";

const { tagStyleByBool } = usePublicHooks();

export function useHook() {
  const form = reactive({
    name: "",
    code: "",
    meta: {
      enabled: undefined
    },
    values: []
  });
  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  // const switchLoadMap = ref({});
  // const { switchStyle } = usePublicHooks();
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const columns: TableColumnList = [
    {
      label: "属性名称",
      prop: "name",
      minWidth: 120
    },
    {
      label: "属性代码",
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
      formatter: ({ createTime }) =>
        dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 210,
      slot: "operation"
    }
  ];

  async function myHandleDelete(row) {
    console.log(row);
  }

  function handleDelete(row) {
    message(`您删除了属性名称为${row.name}的这条数据`, { type: "success" });
    onSearch();
  }

  function handleSizeChange(val: number) {
    console.log(`${val} items per page`);
    onSearch();
  }

  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`);
    onSearch();
  }

  async function handleAttributeValueEdit(row) {
    console.log("attribute value edit clicked", row);
  }

  async function handleAttributeValueDelete(row) {
    console.log("attribute value delete clicked", row);
  }

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  async function onSearch() {
    loading.value = true;
    let filters = {};
    if (form.name) {
      filters["name"] = form.name;
    }
    if (form.meta.enabled !== undefined) {
      filters["meta"] = form.meta;
    }
    const ops = {
      filters,
      currentPage: pagination.currentPage,
      pageSize: pagination.pageSize
    };
    const { data } = await AttributeAPI.getListWithFilter(ops);
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

  async function toggleStatus(id: string, newValue: boolean) {
    let rt = await AttributeAPI.toggleStatus({ id: id }, newValue);
    console.log(rt);
    await onSearch();
  }

  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}属性`,
      props: {
        formInline: {
          _id: row?._id,
          name: row?.name ?? "",
          code: row?.code ?? "",
          meta: {
            enabled: row?.meta?.enabled || null
          },
          values: []
        }
      },
      width: "45%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          message(`您${title}了属性名称为${curData.name}的这条数据`, {
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
              // 实际开发先调用新增接口，再进行下面操作
              await AttributeAPI.create({
                name: curData.name,
                code: curData.code,
                values: curData.values,
                meta: { enabled: curData.meta.enabled }
              });
              chores();
            } else {
              // 实际开发先调用修改接口，再进行下面操作
              await AttributeAPI.update({
                _id: curData._id,
                name: curData.name,
                code: curData.code,
                values: curData.values,
                meta: { enabled: curData.meta.enabled }
              });
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
    myHandleDelete,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    toggleStatus,
    handleAttributeValueEdit,
    handleAttributeValueDelete
  };
}
