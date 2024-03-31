import editForm from "../form.vue";
import { handleTree } from "@/utils/tree";
import { message } from "@/utils/message";
import { RouteAPI } from "@/api/system";
import { transformI18n } from "@/plugins/i18n";
import { addDialog } from "@/components/ReDialog";
import { usePublicThemeHooks } from "@/helpers/theme";
import { reactive, ref, onMounted, h } from "vue";
import type { FormItemProps } from "../utils/types";
import { cloneDeep, isAllEmpty } from "@pureadmin/utils";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ElMessageBox } from "element-plus";
import { usePublicSharedFunctionsHooks } from "@/helpers/sharedFunctions";

export function useHook() {
  const form = reactive({
    title: ""
  });
  const { tagStyleByBool } = usePublicThemeHooks();

  const formRef = ref();
  const dataList = ref([]);
  const dataList_routeAuth = ref([]);
  const loading = ref(true);

  const { formatHigherMenuOptions } = usePublicSharedFunctionsHooks();

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
    // {
    //   label: "组件权限",
    //   prop: "meta.auths"
    // },
    // {
    //   label: "页面权限",
    //   prop: "meta.roles",
    //   // formatter:({ meta }) =>
    //   //   meta.roles
    // },
    {
      label: "排序",
      prop: "meta.rank",
      width: 100
    },
    {
      label: "隐藏",
      prop: "meta.showLink",
      width: 100
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

  async function updateAuthsOptions() {
    const req = await RouteAPI.RouteAuth.getList();
    dataList_routeAuth.value = req.data;
  }

  async function onSearch() {
    loading.value = true;
    const { data } = await RouteAPI.Route.getList(); // getMenuList(); // 这里是返回一维数组结构，前端自行处理成树结构，返回格式要求：唯一id加父节点parentId，parentId取父节点id
    console.log(data);
    let newData = data;
    if (!isAllEmpty(form.title)) {
      // 前端搜索菜单名称
      newData = newData.filter(item =>
        transformI18n(item.meta.title).includes(form.title)
      );
    }
    dataList.value = handleTree(newData, "_id", "parent"); // 处理成树结构
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}菜单`,
      props: {
        formInline: {
          higherOptions: formatHigherMenuOptions(
            cloneDeep(dataList.value.filter(each => each._id !== row?._id))
          ),
          authsOptions: cloneDeep(dataList_routeAuth.value),

          menuType: 0,
          _id: row?._id,
          path: row?.path,
          name: row?.name,
          component: row?.component,
          redirect: row?.redirect,
          meta: {
            title: row?.meta?.title,
            icon: row?.meta?.icon,
            extraIcon: row?.meta?.extraIcon,
            showLink: row?.meta?.showLink,
            showParent: row?.meta?.showParent,
            roles: row?.meta?.roles,
            auths: row?.meta?.auths,
            auths_options: row?.meta?.auths_options || [],
            keepAlive: row?.meta?.keepAlive,
            frameSrc: row?.meta?.frameSrc,
            frameLoading: row?.meta?.frameLoading,
            transition: {
              name: row?.meta?.transition?.name,
              enterTransition: row?.meta?.transition?.enterTransition,
              leaveTransition: row?.meta?.transition?.leaveTransition
            },
            hiddenTag: row?.meta?.hiddenTag,
            dynamicLevel: row?.meta?.dynamicLevel,
            activePath: row?.meta?.activePath,
            rank: row?.meta?.rank,
            enabled: row?.meta?.enabled
          },
          parent: row?.parent
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
          updateAuthsOptions(); // 刷新auth选项
        }
        FormRef.validate(async valid => {
          if (valid) {
            delete curData.higherOptions;
            delete curData.menuType;
            delete curData.authsOptions;
            console.log("curData", curData);
            // 表单规则校验通过
            if (title === "新增") {
              await RouteAPI.Route.create({
                ...curData
              });
              chores();
            } else {
              await RouteAPI.Route.update({
                ...curData
              });
              chores();
            }
          }
        });
      }
    });
  }

  async function toggleStatus(id: string, newValue: boolean) {
    await RouteAPI.Route.toggleStatus({ id }, newValue);
    await onSearch();
  }

  function myHandleDelete(row) {
    console.log(row);
    ElMessageBox.confirm(
      `请确认是否删除菜单: ${transformI18n(row.meta.title)} `,
      {
        type: "warning"
      }
    )
      .then(async () => {
        await RouteAPI.Route.delete({ id: row._id });
        message(`已成功删除了部门: ${transformI18n(row.meta.title)} `, {
          type: "success"
        });
        await onSearch();
      })
      .catch(() => {});
  }

  onMounted(async () => {
    await Promise.all([onSearch(), updateAuthsOptions()]);
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
    myHandleDelete,
    handleSelectionChange,
    toggleStatus
  };
}
