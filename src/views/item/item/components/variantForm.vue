<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { formRules } from "../utils/rule";
import { VariantFormPropsC } from "../utils/types";
import { useHook } from "../utils/hook";
import { ItemAPI } from "@/api/system";
import { Item } from "@/store/modules/types";

const { categoriesOptions, ItemTypeOptions } = useHook();

const props = withDefaults(defineProps<VariantFormPropsC>(), {
  data: () => ({
    _id: undefined,
    variants: []
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.data);

onBeforeMount(async () => {
  let { data } = await ItemAPI.getAllVariants(
    newFormInline.value?._id as string
  );
  if (data) newFormInline.value.variants = data;
});

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <div>
    {{ newFormInline }}
  </div>
</template>
