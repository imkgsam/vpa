import dayjs from "dayjs";
import editForm from "../form.vue";
import { handleTree } from "@/utils/tree";
import { message } from "@/utils/message";
import { CategoryAPI } from "@/api/system";

import { addDialog } from "@/components/ReDialog";
import { reactive, ref, onMounted, h } from "vue";
import type { FormItemProps } from "../utils/types";
import { cloneDeep, isAllEmpty } from "@pureadmin/utils";
import { ElMessageBox } from "element-plus";

export function useHook() {
  const form = reactive({
    name: "",
    parent: null
  });

  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);

  const columns: TableColumnList = [
    {
      label: "类别名称",
      prop: "name",
      width: 200,
      align: "left"
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
    const { data } = await CategoryAPI.getList(); // 这里是返回一维数组结构，前端自行处理成树结构，返回格式要求：唯一id加父节点parentId，parentId取父节点id
    let newData = data;
    if (!isAllEmpty(form.name)) {
      // 前端搜索产品类别名称
      newData = newData.filter(item => item.name.includes(form.name));
    }

    dataList.value = handleTree(newData, "_id", "parent"); // 处理成树结构
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  function formatParentOptions(treeList) {
    // 根据返回数据的status字段值判断追加是否禁用disabled字段，返回处理后的树结构，用于上级产品类别级联选择器的展示（实际开发中也是如此，不可能前端需要的每个字段后端都会返回，这时需要前端自行根据后端返回的某些字段做逻辑处理）
    if (!treeList || !treeList.length) return;
    const newTreeList = [];
    for (let i = 0; i < treeList.length; i++) {
      // treeList[i].disabled = !treeList[i].meta.enabled;
      formatParentOptions(treeList[i].children);
      newTreeList.push(treeList[i]);
    }
    return newTreeList;
  }

  function openDialog(title = "新增", row?: FormItemProps) {
    console.log(title, row?._id);
    addDialog({
      title: `${title}产品类别`,
      props: {
        formInline: {
          _id: row?._id,
          higherDeptOptions: formatParentOptions(
            cloneDeep(dataList.value.filter(each => each._id !== row?._id))
          ),
          parent: row?.parent,
          name: row?.name || ""
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
          message(`您${title}了产品类别名称为${curData.name}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(async valid => {
          if (valid) {
            console.log("curData", curData);
            // 表单规则校验通过
            if (title === "新增") {
              await CategoryAPI.create({
                _id: curData._id,
                name: curData.name,
                parent: curData.parent
              });
              chores();
            } else {
              await CategoryAPI.update({
                _id: curData._id,
                name: curData.name,
                parent: curData.parent
              });
              chores();
            }
          }
        });
      }
    });
  }

  function myHandleDelete(row) {
    console.log("row", row);
    ElMessageBox.confirm(`请确认是否删除产品类别: ${row.name} `, {
      type: "warning"
    })
      .then(async () => {
        await CategoryAPI.delete({ id: row._id });
        message(`已成功删除了产品类别: ${row.name} `, { type: "success" });
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
    /** 搜索 */
    onSearch,
    /** 重置 */
    resetForm,
    /** 打开 新增、修改产品类别 的弹窗*/
    openDialog,
    /** 删除产品类别 */
    myHandleDelete,
    handleSelectionChange
  };
}
