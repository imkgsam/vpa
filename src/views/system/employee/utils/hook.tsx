import "./reset.css";
import dayjs from "dayjs";
import roleForm from "../form/role.vue";
import editForm from "../form/index.vue";
import { zxcvbn } from "@zxcvbn-ts/core";
import { handleTree } from "@/utils/tree";
import { message } from "@/utils/message";
import croppingUpload from "../upload.vue";
import { addDialog } from "@/components/ReDialog";
import type { PaginationProps } from "@pureadmin/table";
import type { FormItemProps, RoleFormItemProps } from "../utils/types";
import {
  // hideTextAtIndex,
  getKeyList,
  isAllEmpty
} from "@pureadmin/utils";
import { usePublicThemeHooks } from "@/helpers/theme";
import { transformI18n } from "@/plugins/i18n";

import {
  getRoleIds,
  getDeptList,
  getAllRoleList,
  EntityAPI
  // AccountAPI
} from "@/api/system";
import {
  ElForm,
  ElInput,
  ElFormItem,
  ElProgress,
  ElMessageBox
} from "element-plus";
import {
  type Ref,
  h,
  ref,
  // toRaw,
  watch,
  computed,
  reactive,
  onMounted
} from "vue";

export function useUser(
  tableRef: Ref
  // , treeRef: Ref
) {
  const form = reactive({
    meta: {
      enabled: undefined,
      verified: undefined,
      isSupplier: undefined,
      isCustomer: undefined
    }
  });

  const formRef = ref();

  const ruleFormRef = ref();

  const dataList = ref([]);
  const loading = ref(true);
  // 上传头像信息
  const avatarInfo = ref();
  // const switchLoadMap = ref({});
  const { tagStyleByBool } = usePublicThemeHooks();
  const higherDeptOptions = ref();
  const treeData = ref([]);
  const treeLoading = ref(true);
  const selectedNum = ref(0);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const columns: TableColumnList = [
    {
      label: "勾选列", // 如果需要表格多选，此处label必须设置
      type: "selection",
      fixed: "left",
      reserveSelection: true // 数据刷新后保留选项
    },
    {
      label: "成员名称",
      prop: "name"
    },
    {
      label: "性别",
      prop: "personal.sex",
      formatter: ({ personal }) =>
        transformI18n(`constant.gender.${personal.sex}`) || "N/A"
    },
    {
      label: "企业邮箱",
      prop: "employee.workEmail",
      formatter: ({ employee }) => employee?.workEmail || "无"
    },
    {
      label: "状态",
      prop: "status",
      width: 100,
      cellRenderer: ({ row, props }) => (
        <div>
          <el-tag
            size={props.size}
            style={tagStyleByBool.value(row.meta.enabled || false)}
          >
            {row?.meta.enabled ? "主体启用" : "主体停用"}
          </el-tag>
          <el-tag
            size={props.size}
            style={tagStyleByBool.value(row.meta.verified || false)}
          >
            {row?.meta.verified ? "主体已认证" : "主体未认证"}
          </el-tag>
          <el-tag
            size={props.size}
            style={tagStyleByBool.value(row.meta.isUser ? true : false)}
          >
            {row.meta.isUser ? "系统用户" : "非系统用户"}
          </el-tag>
          <el-tag
            size={props.size}
            style={tagStyleByBool.value(
              row.account && row.account.meta.enabled ? true : false
            )}
          >
            {row?.account && row?.account?.meta.enabled ? "可登录" : "不可登录"}
          </el-tag>
          <el-tag
            size={props.size}
            style={tagStyleByBool.value(
              row.meta.isEmployee && row.employee ? true : false
            )}
          >
            {row.meta.isEmployee && row.employee ? "员工" : "非员工"}
          </el-tag>
          <el-tag size={props.size} v-show={row.meta.isWorker === true}>
            工人
          </el-tag>
        </div>
      )
    },
    {
      label: "所属部门",
      minWidth: 90,
      prop: "departments",
      cellRenderer: ({ row }) => (
        <div>
          {row?.employee?.departments?.length > 0 ? (
            <ul>
              {row?.employee?.departments.map(each => {
                return <li>{each.name}</li>;
              })}
            </ul>
          ) : (
            "无"
          )}
        </div>
      )
    },
    {
      label: "创建时间",
      minWidth: 90,
      prop: "createdAt",
      formatter: ({ createdAt }) => dayjs(createdAt).format("YYYY-MM-DD")
    },
    {
      label: "操作",
      fixed: "right",
      width: 180,
      slot: "operation"
    }
  ];
  const buttonClass = computed(() => {
    return [
      "!h-[20px]",
      "reset-margin",
      "!text-gray-500",
      "dark:!text-white",
      "dark:hover:!text-primary"
    ];
  });
  // 重置的新密码
  const pwdForm = reactive({
    newPwd: ""
  });
  const pwdProgress = [
    { color: "#e74242", text: "非常弱" },
    { color: "#EFBD47", text: "弱" },
    { color: "#ffa500", text: "一般" },
    { color: "#1bbf1b", text: "强" },
    { color: "#008000", text: "非常强" }
  ];
  // 当前密码强度（0-4）
  const curScore = ref();
  const roleOptions = ref([]);

  // function onChange({ row, index }) {
  //   ElMessageBox.confirm(
  //     `确认要<strong>${
  //       row.status === 0 ? "停用" : "启用"
  //     }</strong><strong style='color:var(--el-color-primary)'>${
  //       row.accountName
  //     }</strong>用户吗?`,
  //     "系统提示",
  //     {
  //       confirmButtonText: "确定",
  //       cancelButtonText: "取消",
  //       type: "warning",
  //       dangerouslyUseHTMLString: true,
  //       draggable: true
  //     }
  //   )
  //     .then(() => {
  //       switchLoadMap.value[index] = Object.assign(
  //         {},
  //         switchLoadMap.value[index],
  //         {
  //           loading: true
  //         }
  //       );
  //       setTimeout(() => {
  //         switchLoadMap.value[index] = Object.assign(
  //           {},
  //           switchLoadMap.value[index],
  //           {
  //             loading: false
  //           }
  //         );
  //         message("已成功修改用户状态", {
  //           type: "success"
  //         });
  //       }, 300);
  //     })
  //     .catch(() => {
  //       row.status === 0 ? (row.status = 1) : (row.status = 0);
  //     });
  // }

  function handleUpdate(row) {
    console.log(row);
  }

  function myHandleDelete(row) {
    ElMessageBox.confirm(`请确认是否删除成员: ${row.name} `, {
      type: "warning"
    })
      .then(async () => {
        await EntityAPI.Employee.delete({ id: row._id });
        message(`已成功删除了成员: ${row.name} `, { type: "success" });
        onSearch();
      })
      .catch(() => {});
  }

  async function toggleStatus(id: string, newValue: boolean) {
    let rt = await EntityAPI.toggleStatus({ id: id }, newValue);
    console.log(rt);
    await onSearch();
  }

  function handleDelete(row) {
    message(`您删除了用户编号为${row.id}的这条数据`, { type: "success" });
    onSearch();
  }

  function handleSizeChange(val: number) {
    console.log(`${val} items per page`);
  }

  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`);
  }

  /** 当CheckBox选择项发生变化时会触发该事件 */
  function handleSelectionChange(val) {
    selectedNum.value = val.length;
    // 重置表格高度
    tableRef.value.setAdaptive();
  }

  /** 取消选择 */
  function onSelectionCancel() {
    selectedNum.value = 0;
    // 用于多选表格，清空用户的选择
    tableRef.value.getTableRef().clearSelection();
  }

  /** 批量删除 */
  function onbatchDel() {
    // 返回当前选中的行
    const curSelected = tableRef.value.getTableRef().getSelectionRows();
    // 接下来根据实际业务，通过选中行的某项数据，比如下面的id，调用接口进行批量删除
    message(`已删除用户编号为 ${getKeyList(curSelected, "id")} 的数据`, {
      type: "success"
    });
    tableRef.value.getTableRef().clearSelection();
    onSearch();
  }

  async function onSearch() {
    loading.value = true;
    const ops = {
      filters: form,
      currentPage: pagination.currentPage,
      pageSize: pagination.pageSize
    };
    const { data } = await EntityAPI.Employee.getPAll(ops);
    dataList.value = data.list;
    pagination.total = data.total;
    pagination.pageSize = data.pageSize;
    pagination.currentPage = data.currentPage;

    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  // async function handleAccountCreateBtnClicked(id: string){
  //   accountForm._id = id
  //   accountFormVisiable.value = true
  // }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    // treeRef.value.onTreeReset();
    onSearch();
  };

  // function onTreeSelect({ id, selected }) {
  //   form.deptId = selected ? id : "";
  //   onSearch();
  // }

  function openDialog(title = "新增", row?: FormItemProps) {
    console.log("entity ", row);
    addDialog({
      title: `${title}成员`,
      props: {
        formInline: {
          title,
          _id: row?._id,
          name: row?.name,
          alias: row?.alias,
          etype: "Person",
          //对于个人是所属的公司，对于公司就是所属的母公司，可选
          scompany: row?.scompany,
          personal: {
            //职位
            jobTitle: row?.personal?.jobTitle,
            //性别
            sex: row?.personal?.sex,
            //生日
            birth: row?.personal?.birth
          },
          common: {
            website: row?.common?.website,
            //邮箱地址，个人-个人邮箱，公司-默认邮箱
            email: row?.common?.email,
            //固话
            landline: row?.common?.landline,
            //手机
            mobilePhone: row?.common?.mobilePhone,
            //所在国家
            country: row?.common?.country,
            //所在城市
            city: row?.common?.city,
            //行业
            industry: row?.common?.industry,
            //内部备注
            internalNote: row?.common?.internalNote
          },
          socialMedias: row?.socialMedias,
          meta: {
            enabled: row?.meta.enabled,
            verified: row?.meta.verified,
            isSupplier: row?.meta.isSupplier,
            isCustomer: row?.meta.isCustomer,
            isEmployee: true,
            isUser: row?.meta.isUser,
            isWorker: row?.meta.isWorker
          },
          account: {
            _id: row?.account?._id,
            accountName: row?.account?.accountName,
            email: row?.account?.email,
            phone: row?.account?.phone,
            entity: row?.account?.entity,
            password: row?.account?.password,
            passwordReset: "",
            roles: row?.account?.roles,
            meta: {
              verified: row?.account?.meta?.verified,
              enabled: row?.account?.meta?.enabled
            }
          },
          employee: {
            _id: row?.employee?._id,
            etype: row?.employee?.etype,
            departments:
              row?.employee?.departments.length > 0
                ? row?.employee?.departments.map(each => each._id)
                : [],
            manager: row?.employee?.manager,
            EID: row?.employee?.EID,
            ETL: row?.employee?.ETL,
            entity: row?.employee?.entity,
            workPhone: row?.employee?.workPhone,
            workMobile: row?.employee?.workMobile,
            workEmail: row?.employee?.workEmail,
            inaugurationDate: row?.employee?.inaugurationDate,
            privacy: {
              family: {
                status: row?.employee?.privacy?.family?.status,
                dependentChildrenCount:
                  row?.employee?.privacy?.family?.dependentChildrenCount
              },
              //国籍
              nationality: {
                country: row?.employee?.privacy?.nationality?.country,
                city: row?.employee?.privacy?.nationality?.city,
                birth: row?.employee?.privacy?.nationality?.birth,
                ID: row?.employee?.privacy?.nationality?.ID,
                passport: row?.employee?.privacy?.nationality?.passport,
                taxNo: row?.employee?.privacy?.nationality?.taxNo,
                driverLicense:
                  row?.employee?.privacy?.nationality?.driverLicense
              },
              //紧急联系
              emergency: {
                //联系人
                contact: row?.employee?.privacy?.emergency?.contact,
                //联系电话
                phone: row?.employee?.privacy?.emergency?.phone
              }
            },
            education: {
              qulification: row?.employee?.education?.qulification,
              school: row?.employee?.education?.school,
              graduatedAt: row?.employee?.education?.graduatedAt,
              major: row?.employee?.education?.major
            },
            meta: {
              enabled: row?.employee?.meta?.enabled
            }
          }
        }
      },
      width: "46%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          message(`您${title}了用户名称为${curData.name}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        delete curData.title;
        if (curData.employee?.EID) {
          curData.employee.EID = curData.employee?.EID?._id;
        }
        FormRef.validate(async valid => {
          if (valid) {
            if (curData?.account?.passwordReset) {
              curData.account.password = curData.account.passwordReset;
            }
            delete curData.account.passwordReset;
            if (title === "新增") {
              await EntityAPI.Employee.create(curData);
            } else {
              await EntityAPI.Employee.update(curData);
            }
            onSearch();
            chores();
          }
        });
      }
    });
  }

  const cropRef = ref();
  /** 上传头像 */
  function handleUpload(row) {
    addDialog({
      title: "裁剪、上传头像",
      width: "40%",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () =>
        h(croppingUpload, {
          ref: cropRef,
          imgSrc: row.avatar,
          onCropper: info => (avatarInfo.value = info)
        }),
      beforeSure: done => {
        console.log("裁剪后的图片信息：", avatarInfo.value);
        // 根据实际业务使用avatarInfo.value和row里的某些字段去调用上传头像接口即可
        done(); // 关闭弹框
        onSearch(); // 刷新表格数据
      },
      closeCallBack: () => cropRef.value.hidePopover()
    });
  }

  watch(
    pwdForm,
    ({ newPwd }) =>
      (curScore.value = isAllEmpty(newPwd) ? -1 : zxcvbn(newPwd).score)
  );

  /** 重置密码 */
  function handleReset(row) {
    addDialog({
      title: `重置 ${row.accountName} 用户的密码`,
      width: "30%",
      draggable: true,
      closeOnClickModal: false,
      contentRenderer: () => (
        <>
          <ElForm ref={ruleFormRef} model={pwdForm}>
            <ElFormItem
              prop="newPwd"
              rules={[
                {
                  required: true,
                  message: "请输入新密码",
                  trigger: "blur"
                }
              ]}
            >
              <ElInput
                clearable
                show-password
                type="password"
                v-model={pwdForm.newPwd}
                placeholder="请输入新密码"
              />
            </ElFormItem>
          </ElForm>
          <div class="mt-4 flex">
            {pwdProgress.map(({ color, text }, idx) => (
              <div
                class="w-[19vw]"
                style={{ marginLeft: idx !== 0 ? "4px" : 0 }}
              >
                <ElProgress
                  striped
                  striped-flow
                  duration={curScore.value === idx ? 6 : 0}
                  percentage={curScore.value >= idx ? 100 : 0}
                  color={color}
                  stroke-width={10}
                  show-text={false}
                />
                <p
                  class="text-center"
                  style={{ color: curScore.value === idx ? color : "" }}
                >
                  {text}
                </p>
              </div>
            ))}
          </div>
        </>
      ),
      closeCallBack: () => (pwdForm.newPwd = ""),
      beforeSure: done => {
        ruleFormRef.value.validate(valid => {
          if (valid) {
            // 表单规则校验通过
            message(`已成功重置 ${row.accountName} 用户的密码`, {
              type: "success"
            });
            console.log(pwdForm.newPwd);
            // 根据实际业务使用pwdForm.newPwd和row里的某些字段去调用重置用户密码接口即可
            done(); // 关闭弹框
            onSearch(); // 刷新表格数据
          }
        });
      }
    });
  }

  /** 分配角色 */
  async function handleRole(row) {
    // 选中的角色列表
    const ids = (await getRoleIds({ userId: row.id })).data ?? [];
    addDialog({
      title: `分配 ${row.accountName} 用户的角色`,
      props: {
        formInline: {
          accountName: row?.accountName ?? "",
          nickname: row?.nickname ?? "",
          roleOptions: roleOptions.value ?? [],
          ids
        }
      },
      width: "400px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(roleForm),
      beforeSure: (done, { options }) => {
        const curData = options.props.formInline as RoleFormItemProps;
        console.log("curIds", curData.ids);
        // 根据实际业务使用curData.ids和row里的某些字段去调用修改角色接口即可
        done(); // 关闭弹框
      }
    });
  }

  onMounted(async () => {
    treeLoading.value = true;
    onSearch();

    // 归属部门
    const { data } = await getDeptList();
    higherDeptOptions.value = handleTree(data);
    treeData.value = handleTree(data);
    treeLoading.value = false;

    // 角色列表
    roleOptions.value = (await getAllRoleList()).data;
  });

  return {
    form,
    loading,
    columns,
    dataList,
    treeData,
    treeLoading,
    selectedNum,
    pagination,
    buttonClass,
    onSearch,
    resetForm,
    onbatchDel,
    openDialog,
    // onTreeSelect,
    handleUpdate,
    handleDelete,
    handleUpload,
    handleReset,
    handleRole,
    handleSizeChange,
    onSelectionCancel,
    handleCurrentChange,
    handleSelectionChange,

    myHandleDelete,
    toggleStatus
  };
}
