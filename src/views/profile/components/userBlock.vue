<script setup>
defineOptions({
  name: "UserBlock"
});
const props = defineProps(["user"]);
</script>

<template>
  <div>
    {{ user }}
  </div>
</template>
