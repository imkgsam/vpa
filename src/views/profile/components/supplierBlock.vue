<script setup lang="ts">
import { ref, reactive, onBeforeMount, toRaw, onMounted } from "vue";
import { Supplier } from "@/store/modules/types";
import { useI18n } from "vue-i18n";
import { FormInstance } from "element-plus";
import { merge } from "lodash";

const ruleFormRef = ref<FormInstance>();
const { t } = useI18n();

defineOptions({
  name: "SupplierBlock"
});
const props = defineProps(["supplier"]);
const editing = ref(false);
const loading = ref(false);
var dataForm = reactive<Supplier>({
  _id: ""
});

onBeforeMount(() => {
  merge(dataForm, props.supplier);
});

async function save() {
  if (!editing.value) {
    console.log("editing...");
    editing.value = !editing.value;
  } else {
    loading.value = true;
    console.log("saving...");
    setTimeout(() => {
      loading.value = false;
      editing.value = !editing.value;
    }, 3000);
  }
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

async function cancle(formEl: FormInstance | undefined) {
  resetForm(formEl);
  merge(dataForm, props.supplier);
  editing.value = !editing.value;
}
</script>

<template>
  <div>
    <!-- <el-form>
      <el-row :gutter="10">
        <el-col v-motion :xs="24" :lg="12">
          <el-form-item :label="t('label.accountName')">
            <el-input v-if="editing" :value="props.supplier.accountName" v-model="dataForm.accountName" />
            <span v-else>{{ props.supplier.accountName }}</span>
          </el-form-item>
        </el-col>
        <el-col v-motion :xs="24" :lg="12">
          <el-form-item :label="t('label.email')">
            <span>{{ props.supplier.email || '无' }}</span>
          </el-form-item>
        </el-col>
        <el-col v-motion :xs="24" :lg="12">
          <el-form-item :label="t('label.roles')">
            <el-tag type="success" size="small" v-for="(role, idx) in props.supplier.roles" :key="idx">
              {{ role }}
            </el-tag>
          </el-form-item>
        </el-col>
        <el-col v-motion :xs="24">
          <el-form-item class="flex right">
            <el-button :loading="loading" type="default" @click="cancle(ruleFormRef)" v-if="editing">
              {{ '取消' }}
            </el-button>
            <el-button :loading="loading" :type="editing ? 'primary' : 'warning'" @click="save">{{
              editing
              ? '保存' : '修改'
            }}</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form> -->

    <div>
      <h4>store</h4>
      {{ props.supplier }}
    </div>
  </div>
</template>
