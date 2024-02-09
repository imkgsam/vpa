<script setup lang="ts">
import dayjs from "dayjs";
import MdEditor from "md-editor-v3";
import TypeIt from "@/components/ReTypeit";
import { onBeforeMount, unref, ref, computed, markRaw, toRaw } from "vue";
import Info from "@iconify-icons/ri/information-line";
import DescriptionTooltip from "@/components/descriptionTooltip/index.vue";
import Setting from "@iconify-icons/ri/settings-3-line";
import AccountCircleLine from "@iconify-icons/ri/account-circle-line";
import LockPasswordLine from "@iconify-icons/ri/lock-password-line";
import { useTranslationLang } from "@/layout/hooks/useTranslationLang";
import { useUserStoreHook } from "@/store/modules/user";
import { genAvatarText } from "@/utils/stringUtils";
// import UserBlock from "./components/userBlock.vue";
import EmployeeBlock from "./components/employeeBlock.vue";
import CustomerBlock from "./components/customerBlock.vue";
import SupplierBlock from "./components/supplierBlock.vue";
import SecurityBlock from "./components/securityBlock.vue";
import SystemSettingsBlock from "./components/systemSettingsBlock.vue";
import EntityBlock from "./components/entityBlock.vue";

const { t } = useTranslationLang();

defineOptions({
  name: "Profile"
});

onBeforeMount(async () => {
  await useUserStoreHook().requestEntity();
});

var userStore = useUserStoreHook();

const userInfo = {
  avatarText: genAvatarText(userStore.user.accountName),
  user: userStore.user,
  entity: userStore.entity,
  employee: userStore.employee,
  supplier: userStore.supplier,
  customer: userStore.customer
};

const tag = ref("default");

function hangleTagBtnClick(newTag: string) {
  tag.value = newTag;
}
</script>

<template>
  <el-row class="w-full lg:w-11/12 xl:10/12 !mx-auto" :gutter="20">
    <el-col v-motion :xs="24" :sm="24" :md="9" :lg="8" :xl="8">
      <el-card class="text-center">
        <el-avatar
          :size="100"
          shape="square"
          class="mt-5 !rounded-lg"
          style="

--el-avatar-text-size: 60px; --el-avatar-bg-color: #002140"
          text-size="50px"
          src="https://vue.envytheme.com/adlash/img/user14.9b76cd7b.jpg"
        >
          {{ userInfo.avatarText }}
        </el-avatar>
        <h3 class="mt-3 text-gray-700">{{ userInfo.entity.name }}</h3>
        <el-divider />
        <div>
          <!-- <h4 class="text-left my-2">DETAILS:</h4> -->
          <el-descriptions class="" :column="1" size="small" border>
            <el-descriptions-item :label="t('label.accountName')">
              <DescriptionTooltip :value="userInfo.user.accountName" />
            </el-descriptions-item>
            <el-descriptions-item :label="t('label.email')">
              <DescriptionTooltip :value="userInfo.user.email" />
            </el-descriptions-item>
            <el-descriptions-item :label="t('label.roles')">
              <el-tag v-for="role in userInfo.user.roles" :key="role">
                {{ role }}
              </el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </el-card>
    </el-col>
    <el-col v-motion :xs="24" :sm="24" :md="15" :lg="16" :xl="16">
      <div class="buttongroup py-2">
        <el-button
          :class="
            tag === 'default' ? 'el-button--primary' : 'is-text btn-border'
          "
          @click="hangleTagBtnClick('default')"
        >
          <IconifyIconOffline :icon="AccountCircleLine" style="margin: 5px" />
          {{ t("buttons.defaultInfo") }}
        </el-button>
        <!-- <el-button :class="tag === 'user' ? 'el-button--primary' : 'is-text btn-border'"
          @click="hangleTagBtnClick('user')">
          <IconifyIconOffline :icon="AccountCircleLine" style="margin: 5px" />
          {{ t("buttons.account") }}
        </el-button> -->
        <el-button
          v-if="userInfo.employee._id"
          :class="
            tag === 'employee' ? 'el-button--primary' : 'is-text btn-border'
          "
          @click="hangleTagBtnClick('employee')"
        >
          <IconifyIconOffline :icon="AccountCircleLine" style="margin: 5px" />
          {{ t("buttons.employee") }}
        </el-button>
        <el-button
          v-if="userInfo.customer._id"
          :class="
            tag === 'customer' ? 'el-button--primary' : 'is-text btn-border'
          "
          @click="hangleTagBtnClick('customer')"
        >
          <IconifyIconOffline :icon="AccountCircleLine" style="margin: 5px" />
          {{ t("buttons.customer") }}
        </el-button>
        <el-button
          v-if="userInfo.supplier._id"
          :class="
            tag === 'supplier' ? 'el-button--primary' : 'is-text btn-border'
          "
          @click="hangleTagBtnClick('supplier')"
        >
          <IconifyIconOffline :icon="AccountCircleLine" style="margin: 5px" />
          {{ t("buttons.supplier") }}
        </el-button>
        <el-button
          :class="
            tag === 'security' ? 'el-button--primary' : 'is-text btn-border'
          "
          @click="hangleTagBtnClick('security')"
        >
          <IconifyIconOffline :icon="LockPasswordLine" style="margin: 5px" />
          {{ t("buttons.security") }}
        </el-button>
        <el-button
          :class="
            tag === 'activity' ? 'el-button--primary' : 'is-text btn-border'
          "
          @click="hangleTagBtnClick('activity')"
        >
          <IconifyIconOffline :icon="AccountCircleLine" style="margin: 5px" />
          {{ t("buttons.activity") }}
        </el-button>
        <el-button
          :class="
            tag === 'system config'
              ? 'el-button--primary'
              : 'is-text btn-border'
          "
          @click="hangleTagBtnClick('system config')"
        >
          <IconifyIconOffline :icon="AccountCircleLine" style="margin: 5px" />
          {{ t("buttons.systemConfig") }}
        </el-button>
      </div>
      <el-card shadow="hover">
        <div v-if="tag === 'default'">
          <EntityBlock :entity="userInfo.entity" />
        </div>
        <!-- <div v-if="tag === 'user'">
          <UserBlock :user="userInfo.user" />
        </div> -->
        <div v-if="tag === 'employee'">
          <EmployeeBlock :employee="userInfo.employee" />
        </div>
        <div v-if="tag === 'customer'">
          <CustomerBlock :customer="userInfo.customer" />
        </div>
        <div v-if="tag === 'supplier'">
          <SupplierBlock :supplier="userInfo.customer" />
        </div>
        <div v-if="tag === 'security'">
          <SecurityBlock :userEmail="userInfo.user.email" />
        </div>
        <div v-if="tag === 'activity'">activity</div>
        <div v-if="tag === 'system config'">
          <SystemSettingsBlock />
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<style scoped lang="scss">
.btn-border {
  border: 0.8px solid transparent;
}

div.buttongroup {
  overflow-x: scroll;
  white-space: nowrap;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  button {
    padding: 14px;
    text-align: center;
    text-decoration: none;
  }

  button:hover {
    background-color: #777;
  }
}
</style>
