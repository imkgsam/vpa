<script setup></script>

<template>
  <div>
    mylayout
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </div>
</template>
