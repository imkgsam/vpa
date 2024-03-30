<script setup lang="ts">
import { ref, reactive, onMounted, toRaw, onBeforeMount, watch } from "vue";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import { useUserStoreHook } from "@/store/modules/user";
import { UserAccount } from "@/store/modules/types";
import { merge, assign } from "lodash";
import { FormInstance } from "element-plus";
import { AccountAPI } from "@/api/system";
import { storageLocal } from "@pureadmin/utils";
import { type DataInfo, userKey } from "@/utils/auth";

const ruleFormRef = ref<FormInstance>();
const { t } = useI18n();
defineOptions({
  name: "AccountBlock"
});
const editing = ref(false);
const loading = ref(false);
const props = defineProps(["account"]);

var dataForm = reactive<UserAccount>({
  _id: "",
  accountName: "",
  email: "",
  roles: [],
  entity: ""
});

onBeforeMount(() => {
  console.log("in onBeforeMount");
  console.log(props.account);
  merge(dataForm, props.account);
});

async function save() {
  if (!editing.value) {
    editing.value = !editing.value;
  } else {
    loading.value = true;
    let rt = await AccountAPI.update({
      accountName: dataForm.accountName,
      _id: dataForm._id
    });
    const { data } = rt;
    useUserStoreHook().SET_ACCOUNT(data);

    let UserInfo = storageLocal().getItem<DataInfo<number>>(userKey);
    console.log("userinfo", UserInfo);
    storageLocal().setItem(userKey, {
      ...UserInfo,
      account: data
    });
    loading.value = false;
    editing.value = !editing.value;
  }
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

async function cancle(formEl: FormInstance | undefined) {
  resetForm(formEl);
  merge(dataForm, props.account);
  editing.value = !editing.value;
}
</script>

<template>
  <div>
    <el-divider content-position="left">{{
      t("common.text.accountDetail")
    }}</el-divider>
    <el-form ref="ruleFormRef" :model="dataForm">
      <el-row :gutter="25">
        <el-col v-motion :xz="24" :lg="12">
          <el-form-item :label="t('label.accountName')">
            <el-input
              v-if="editing"
              v-model="dataForm.accountName"
              :value="dataForm.accountName"
            />
            <span v-else>{{ dataForm.accountName }}</span>
          </el-form-item>
        </el-col>
        <el-col v-motion :xz="24" :lg="12">
          <el-form-item :label="t('label.pemail')">
            <el-input v-if="editing" v-model="dataForm.email" />
            <span v-else>{{ props.account.email || "无" }}</span>
          </el-form-item>
        </el-col>
        <el-col v-motion :xs="24" :lg="12">
          <el-form-item class="flex right">
            <el-button
              v-if="editing"
              :loading="loading"
              type="default"
              @click="cancle(ruleFormRef)"
            >
              {{ "取消" }}
            </el-button>
            <el-button
              :loading="loading"
              :type="editing ? 'primary' : 'warning'"
              @click="save"
              >{{ editing ? "保存" : "修改" }}</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
