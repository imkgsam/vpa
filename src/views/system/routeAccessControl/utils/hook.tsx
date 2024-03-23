import dayjs from "dayjs";
import editForm from "../form.vue";
import { message } from "@/utils/message";
import { RouteAPI, UserAPI } from "@/api/system";
// import { ElMessageBox } from "element-plus";
import { usePublicHooks } from "../../hooks";
import { addDialog } from "@/components/ReDialog";
import type { FormItemProps } from "../utils/types";
import type { PaginationProps } from "@pureadmin/table";
import { reactive, ref, onMounted, h } from "vue";
import { ElMessageBox } from "element-plus";
import { useEntityStoreHook } from "@/store/modules/entity";
import { cloneDeep } from "@pureadmin/utils";
import { transformI18n } from "@/plugins/i18n";
import { handleTree } from "@/utils/tree";

const { tagStyleByBool } = usePublicHooks();

export function useHook() {
  const form = reactive({
    user: null,
    role: null,
    route: null,
    meta: {
      enabled: undefined
    }
  });
  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);

  const userList = ref([]);
  const roleList = ref([]);
  const routeList = ref([]);
  const authList = ref([]);

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
      label: "用户",
      prop: "user",
      formatter: ({ user }) => (user ? user.email : "-")
    },
    {
      label: "角色",
      prop: "role",
      formatter: ({ role }) => (role ? role.code : "-")
    },
    {
      label: "路由",
      prop: "route.title"
    },
    {
      label: "Auth",
      prop: "auths",
      formatter: ({ auths }) =>
        auths.length > 0 ? auths.map(each => each.name) : "-"
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
      minWidth: 120,
      prop: "createdAt",
      formatter: ({ createdAt }) =>
        dayjs(createdAt).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 100,
      slot: "operation"
    }
  ];

  function myHandleDelete(row) {
    ElMessageBox.confirm(`请确认是否删除: ${row.name} `, {
      type: "warning"
    })
      .then(async () => {
        let rt = await RouteAPI.RouteAccess.delete({ id: row._id });
        console.log(rt);
        message(`已成功删除了一条权限`, { type: "success" });
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

  async function requestAllOptions() {
    const [rt, rt1, rt2] = await Promise.all([
      UserAPI.getList(),
      RouteAPI.Route.getList(),
      RouteAPI.RouteAuth.getList()
    ]);
    if (rt && rt.data) userList.value = rt.data;

    if (rt1 && rt1.data) {
      let newData = rt1.data.filter(item => transformI18n(item.meta.title));
      newData = newData.map(each => {
        each.title = transformI18n(each.meta.title);
        return each;
      });
      routeList.value = handleTree(newData, "_id", "parent");
    }

    if (rt2 && rt2.data) authList.value = rt2.data;
  }

  async function onSearch() {
    loading.value = true;
    let filters = {};
    if (form.user) {
      filters["user"] = form.user;
    }
    if (form.role) {
      filters["role"] = form.role;
    }
    if (form.route) {
      filters["route"] = form.route;
    }
    if (form.meta.enabled !== undefined) {
      filters["meta"] = form.meta;
    }
    const ops = {
      filters,
      currentPage: pagination.currentPage,
      pageSize: pagination.pageSize
    };
    const { data } = await RouteAPI.RouteAccess.getPListWithFilter(ops);
    dataList.value = data.list.map(each => {
      each.route.title = transformI18n(each.route.meta.title);
      return each;
    });
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

  function openDialog(title = "新增", row?) {
    addDialog({
      title: `${title}`,
      props: {
        formInline: {
          roleList: cloneDeep(roleList.value),
          userList: cloneDeep(userList.value),
          routeTree: cloneDeep(routeList.value),

          auths_options: cloneDeep(row?.route?.meta?.auths_options),

          _id: row?._id ?? null,
          user: row?.user?._id ?? null,
          role: row?.role?._id ?? null,
          route: row?.route?._id ?? null,
          auths: row?.auths.length ? row?.auths.map(each => each._id) : [],
          meta: {
            enabled: row?.meta?.enabled || false
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
          message(`您${title}了一条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(async valid => {
          if (valid) {
            delete curData.userList;
            delete curData.roleList;
            delete curData.routeTree;
            delete curData.auths_options;
            console.log("curData", curData);
            // 表单规则校验通过
            if (title === "新增") {
              await RouteAPI.RouteAccess.create({
                ...curData
              });
              chores();
            } else {
              await RouteAPI.RouteAccess.update({
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
    let rt = await RouteAPI.RouteAccess.toggleStatus({ id: id }, newValue);
    console.log(rt);
    await onSearch();
  }

  /** 数据权限 可自行开发 */
  // function handleDatabase() {}

  onMounted(async () => {
    console.log(" in onmounted");
    onSearch();
    requestAllOptions();
    roleList.value = await useEntityStoreHook().getAllRoles_public(false);
    console.log(roleList);
  });

  return {
    userList,
    roleList,
    routeList,

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
