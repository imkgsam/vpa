<script setup lang="ts">
import { reactive, ref, onMounted, onBeforeUnmount, unref } from "vue";
import { isSuccessRes } from "@/utils/http/helper";
import { message } from "@/utils/message";
import { useUserStoreHook } from "@/store/modules/user";
import { resetPasswordRules } from "../utils/rule";
import type { FormInstance } from "element-plus";
import { useI18n } from "vue-i18n";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Lock from "@iconify-icons/ri/lock-fill";

const { t } = useI18n();

const repeatPasswordRule = [
  {
    validator: (rule, value, callback) => {
      if (value === "") {
        callback(new Error(t("login.passwordSureReg")));
      } else if (ruleForm.newPassword !== value) {
        callback(new Error(t("login.passwordDifferentReg")));
      } else {
        callback();
      }
    },
    trigger: "blur"
  }
];

defineOptions({
  name: "ChangePasswordBlock"
});
const props = defineProps(["userEmail"]);
const ruleFormRef = ref<FormInstance>();
const loading = ref(false);

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

const ruleForm = reactive({
  oldPassword: "",
  newPassword: "",
  newPasswordV: ""
});

onMounted(() => {
  window.document.addEventListener("keypress", onkeypress);
});

onBeforeUnmount(() => {
  window.document.removeEventListener("keypress", onkeypress);
});

const onChangePassword = async (formEl: FormInstance | undefined) => {
  loading.value = true;
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      useUserStoreHook()
        .changePasswordByEmail({
          email: props.userEmail,
          oldPassword: ruleForm.oldPassword,
          newPassword: ruleForm.newPassword
        })
        .then(res => {
          if (isSuccessRes(res)) {
            message("修改密码成功", { type: "success" });
            resetForm(unref(ruleFormRef));
          } else {
            message("修改密码失败", { type: "error" });
          }
        })
        .finally(() => (loading.value = false))
        .catch(err => {
          message(err?.response.data.message, { type: "error" });
        });
    } else {
      loading.value = false;
      return fields;
    }
  });
};
</script>

<template>
  <div>
    <div>
      <h3 class="my-4">{{ t("common.text.changePassword") }}</h3>
      <el-form
        ref="ruleFormRef"
        label-position="top"
        label-width="100px"
        :model="ruleForm"
        :rules="resetPasswordRules"
      >
        <el-row :gutter="5">
          <el-col v-motion :xs="24" :sm="12" :xl="8">
            <el-form-item prop="oldPassword">
              <el-input
                v-model="ruleForm.oldPassword"
                clearable
                show-password
                :placeholder="t('login.oldPassword')"
                :prefix-icon="useRenderIcon(Lock)"
              />
            </el-form-item>
          </el-col>
          <el-col v-motion :xs="24" :sm="12" :xl="8">
            <el-form-item prop="newPassword">
              <el-input
                v-model="ruleForm.newPassword"
                clearable
                show-password
                :placeholder="t('login.newPassword')"
                :prefix-icon="useRenderIcon(Lock)"
              />
            </el-form-item>
          </el-col>
          <el-col v-motion :xs="24" :sm="12" :xl="8">
            <el-form-item prop="newPasswordV" :rules="repeatPasswordRule">
              <el-input
                v-model="ruleForm.newPasswordV"
                clearable
                show-password
                :placeholder="t('login.confirmPassword')"
                :prefix-icon="useRenderIcon(Lock)"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button
            class="mt-3"
            size="default"
            type="primary"
            :loading="loading"
            @click="onChangePassword(ruleFormRef)"
          >
            {{ t("buttons.submit") }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
