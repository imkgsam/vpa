<script setup>
defineOptions({
  name: "phoneTSVBlock"
});
const props = defineProps(["userEmail"]);
</script>

<template>
  <div>
    {{ userEmail }}
  </div>
</template>
