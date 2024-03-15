// import dayjs from "dayjs";
import editForm from "../form.vue";
import { handleTree } from "@/utils/tree";
import { message } from "@/utils/message";
import { DepartmentAPI } from "@/api/system";

import { usePublicHooks } from "../../hooks";
import { addDialog } from "@/components/ReDialog";
import { reactive, ref, onMounted, h } from "vue";
import type { FormItemProps } from "../utils/types";
import { cloneDeep, isAllEmpty } from "@pureadmin/utils";
import { ElMessageBox } from "element-plus";

export function useDept() {
  const form = reactive({
    name: "",
    meta: {
      enabled: null
    }
  });

  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  const { tagStyleByBool } = usePublicHooks();

  const columns: TableColumnList = [
    {
      label: "部门名称",
      prop: "name",
      width: 200,
      align: "left"
    },
    {
      label: "部门颜色",
      prop: "color",
      width: 100,
      // align: "left"
      cellRenderer: ({ row }) => (
        <div class="flex justify-center">
          <iconify-icon-online
            color={row.color}
            icon="ri:checkbox-blank-circle-fill"
          />
        </div>
      )
    },
    {
      label: "部门主管",
      prop: "manager",
      width: 100,
      // align: "left"
      cellRenderer: ({ row, props }) => (
        <el-tag size={props.size} type={row?.manager?._id ? "primary" : "info"}>
          {row?.manager?._id ? row.manager.name : "无"}
        </el-tag>
      )
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
    const { data } = await DepartmentAPI.getList(); // 这里是返回一维数组结构，前端自行处理成树结构，返回格式要求：唯一id加父节点parentId，parentId取父节点id
    let newData = data;
    if (!isAllEmpty(form.name)) {
      // 前端搜索部门名称
      newData = newData.filter(item => item.name.includes(form.name));
    }
    if (!isAllEmpty(form.meta.enabled)) {
      // 前端搜索状态
      newData = newData.filter(item => item.meta.enabled === form.meta.enabled);
    }
    dataList.value = handleTree(newData, "_id", "parent"); // 处理成树结构
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  function formatHigherDeptOptions(treeList) {
    // 根据返回数据的status字段值判断追加是否禁用disabled字段，返回处理后的树结构，用于上级部门级联选择器的展示（实际开发中也是如此，不可能前端需要的每个字段后端都会返回，这时需要前端自行根据后端返回的某些字段做逻辑处理）
    if (!treeList || !treeList.length) return;
    const newTreeList = [];
    for (let i = 0; i < treeList.length; i++) {
      treeList[i].disabled = !treeList[i].meta.enabled;
      formatHigherDeptOptions(treeList[i].children);
      newTreeList.push(treeList[i]);
    }
    return newTreeList;
  }

  async function toggleStatus(id: string, newValue: boolean) {
    let rt = await DepartmentAPI.toggleStatus({ _id: id }, newValue);
    console.log(rt);
    await onSearch();
  }

  function openDialog(title = "新增", row?: FormItemProps) {
    console.log(title, row?._id);
    addDialog({
      title: `${title}部门`,
      props: {
        formInline: {
          _id: row?._id,
          higherDeptOptions: formatHigherDeptOptions(
            cloneDeep(dataList.value.filter(each => each._id !== row?._id))
          ),
          parent: row?.parent,
          name: row?.name || "",
          manager: row?.manager || { _id: null, name: null },
          meta: {
            enabled: row?.meta?.enabled || null
          },
          color: row?.color || ""
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
          message(`您${title}了部门名称为${curData.name}的这条数据`, {
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
              await DepartmentAPI.create({
                name: curData.name,
                _id: curData._id,
                color: curData.color,
                meta: { enabled: curData.meta.enabled },
                manager: curData?.manager._id || null,
                parent: curData.parent
              });
              chores();
            } else {
              // 实际开发先调用修改接口，再进行下面操作
              await DepartmentAPI.update({
                name: curData.name,
                _id: curData._id,
                color: curData.color,
                meta: { enabled: curData.meta.enabled },
                manager: curData?.manager._id || null,
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
    ElMessageBox.confirm(`请确认是否删除部门: ${row.name} `, {
      type: "warning"
    })
      .then(async () => {
        let rt = await DepartmentAPI.delete({ _id: row._id });
        console.log(rt);
        message(`已成功删除了部门: ${row.name} `, { type: "success" });
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
    /** 打开 新增、修改部门 的弹窗*/
    openDialog,
    /** 删除部门 */
    myHandleDelete,
    handleSelectionChange,
    /** 修改部门状态 */
    toggleStatus
  };
}
