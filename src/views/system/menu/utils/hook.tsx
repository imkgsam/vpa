import editForm from "../form.vue";
import { handleTree } from "@/utils/tree";
import { message } from "@/utils/message";
import { RouteAPI } from "@/api/system";
import { transformI18n } from "@/plugins/i18n";
import { addDialog } from "@/components/ReDialog";
import { reactive, ref, onMounted, h } from "vue";
import type { FormItemProps } from "../utils/types";
import { cloneDeep, isAllEmpty } from "@pureadmin/utils";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

export function useMenu() {
  const form = reactive({
    title: ""
  });

  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);

  // const getMenuType = (type, text = false) => {
  //   switch (type) {
  //     case 0:
  //       return text ? "菜单" : "primary";
  //     case 1:
  //       return text ? "iframe" : "warning";
  //     case 2:
  //       return text ? "外链" : "danger";
  //     case 3:
  //       return text ? "按钮" : "info";
  //   }
  // };

  const columns: TableColumnList = [
    {
      label: "菜单名称",
      prop: "meta.title",
      align: "left",
      cellRenderer: ({ row }) => (
        <>
          <span class="inline-block mr-1">
            {h(useRenderIcon(row.meta.icon), {
              style: { paddingTop: "1px" }
            })}
          </span>
          <span>{transformI18n(row.meta.title)}</span>
        </>
      )
    },
    // {
    //   label: "菜单类型",
    //   prop: "menuType",
    //   width: 100,
    //   cellRenderer: ({ row, props }) => (
    //     <el-tag
    //       size={props.size}
    //       type={getMenuType(row.menuType)}
    //       effect="plain"
    //     >
    //       {getMenuType(row.menuType, true)}
    //     </el-tag>
    //   )
    // },
    {
      label: "路由路径",
      prop: "path"
    },
    {
      label: "组件路径",
      prop: "component",
      formatter: ({ path, component }) =>
        isAllEmpty(component) ? path : component
    },
    {
      label: "权限标识",
      prop: "meta.auths"
    },
    {
      label: "排序",
      prop: "meta.rank",
      width: 100
    },
    {
      label: "隐藏",
      prop: "meta.showLink",
      formatter: ({ showLink }) => (showLink ? "否" : "是"),
      width: 100
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
    const { data } = await RouteAPI.getList(); // getMenuList(); // 这里是返回一维数组结构，前端自行处理成树结构，返回格式要求：唯一id加父节点parentId，parentId取父节点id
    console.log(data);
    let newData = data;
    if (!isAllEmpty(form.title)) {
      // 前端搜索菜单名称
      newData = newData.filter(item =>
        transformI18n(item.meta.title).includes(form.title)
      );
    }
    dataList.value = handleTree(newData, "_id", "parent"); // 处理成树结构
    console.log(dataList.value);
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  function formatHigherMenuOptions(treeList) {
    if (!treeList || !treeList.length) return;
    const newTreeList = [];
    for (let i = 0; i < treeList.length; i++) {
      treeList[i].title = transformI18n(treeList[i].meta.title);
      formatHigherMenuOptions(treeList[i].children);
      newTreeList.push(treeList[i]);
    }
    return newTreeList;
  }

  // function formatHigherDeptOptions(treeList) {
  //   // 根据返回数据的status字段值判断追加是否禁用disabled字段，返回处理后的树结构，用于上级部门级联选择器的展示（实际开发中也是如此，不可能前端需要的每个字段后端都会返回，这时需要前端自行根据后端返回的某些字段做逻辑处理）
  //   if (!treeList || !treeList.length) return;
  //   const newTreeList = [];
  //   for (let i = 0; i < treeList.length; i++) {
  //     treeList[i].disabled = !treeList[i].meta.enabled;
  //     formatHigherDeptOptions(treeList[i].children);
  //     newTreeList.push(treeList[i]);
  //   }
  //   return newTreeList;
  // }

  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}菜单`,
      props: {
        formInline: {
          higherOptions: formatHigherMenuOptions(
            cloneDeep(dataList.value.filter(each => each._id !== row?._id))
          ),
          ...row
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
          message(
            `您${title}了菜单名称为${transformI18n(curData.name)}的这条数据`,
            {
              type: "success"
            }
          );
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

  function handleDelete(row) {
    message(`您删除了菜单名称为${transformI18n(row.title)}的这条数据`, {
      type: "success"
    });
    onSearch();
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
    /** 新增、修改菜单 */
    openDialog,
    /** 删除菜单 */
    handleDelete,
    handleSelectionChange
  };
}
