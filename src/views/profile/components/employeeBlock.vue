<script setup>
defineOptions({
  name: "EmployeeBlock"
});
const props = defineProps(["employee"]);
</script>

<template>
  <div>
    {{ employee }}
  </div>
</template>
