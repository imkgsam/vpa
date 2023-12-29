<script setup lang="ts">
import { ref, reactive, onBeforeMount, toRaw } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
defineOptions({
  name: "EntityBlock"
});
const editing = ref(false);
const loading = ref(false);
const props = defineProps(["entity"]);
const ruleForm = reactive({
  name: ""
});

onBeforeMount(() => {
  console.log("entity");
  console.log(toRaw(props.entity));
});

function handleEntityEditAndSave() {
  loading.value = true;
  setTimeout(() => {
    console.log("sdf");
  }, 1000);
  editing.value = !editing.value;
  loading.value = false;
}
</script>

<template>
  <div>
    <!-- <el-form>
      <el-form-item :label="t('label.fullName')">
        <el-input v-if="editing" :value="props.entity.name" />
        <span v-else>{{ props.entity.name }}</span>
      </el-form-item>
      <el-form-item :label="t('label.alias')" v-if="props.entity.alias">
        <el-input v-if="editing" :value="props.entity.alias" />
        <span v-else>{{ props.entity.alias }}</span>
      </el-form-item>
      <el-form-item :label="t('label.etype')">
        <el-radio-group v-model="props.entity.etype" :disabled="!editing">
          <el-radio label="Person">个人</el-radio>
          <el-radio label="Company">公司</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="t('label.scompany')" v-if="props.entity.scompany">
        <span v-if="!editing">{{ props.entity.scompany?.name }}</span>
        <el-input v-else :value="props.entity.scompany?.name" />
      </el-form-item>
      <el-form-item :label="t('label.jobTitle')" v-if="props.entity.etype === 'Person'">
        <el-input v-if="editing" :value="props.entity.personal.jobTitle" />
        <span v-else>{{ props.entity.personal?.jobTitle }}</span>
      </el-form-item>
      <el-form-item :label="t('label.sex')" v-if="props.entity.etype === 'Person'">
        <el-radio-group :disabled="!editing" v-model="props.entity.personal.sex">
          <el-radio label="Male">男性</el-radio>
          <el-radio label="Female">女性</el-radio>
          <el-radio label="Others">其他</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" :type="editing ? 'primary' : 'warning'" @click="handleEntityEditAndSave">{{
          editing
          ? '保存' : '修改'
        }}</el-button>
      </el-form-item>
    </el-form> -->

    <div>
      {{ entity }}
    </div>
  </div>
</template>
