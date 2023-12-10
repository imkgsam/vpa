<script setup lang="ts">
import TypeIt from "@/components/ReTypeit";
import { useWindowSize } from "@vueuse/core";
import { ref, computed, markRaw } from "vue";
import VerifiedBadgeFill from "@iconify-icons/ri/verified-badge-fill";
import DescriptionTooltip from "@/components/descriptionTooltip/index.vue";

const loading = ref<boolean>(true);

const { height } = useWindowSize();

setTimeout(() => {
  loading.value = !loading.value;
}, 800);
</script>

<template>
  <el-card>
    <div class="text-center">
      <el-avatar :size="100" src="https://picsum.photos/200" />
    </div>
    <div class="text-center">
      <h3 class="m-auto inline-block mt-3">Richard Marshall</h3>
      <IconifyIconOffline
        class="inline-block ml-3"
        :icon="VerifiedBadgeFill"
        color="green"
      />
      <div>web developer</div>
    </div>
    <div class="flex mt-3 justify-center">
      <el-button type="primary" size="small">
        <IconifyIconOffline
          class="mr-1"
          :icon="VerifiedBadgeFill"
          color="green"
        />
        Edit Profile
      </el-button>
      <el-button type="success" size="small">
        <IconifyIconOffline
          class="mr-1"
          :icon="VerifiedBadgeFill"
          color="green"
        />
        Add Friend
      </el-button>
    </div>
    <el-divider />
    <div>
      <el-descriptions
        class=""
        title="Information"
        :column="1"
        size="small"
        border
      >
        <template #extra>
          <el-button size="small" type="primary">Operation</el-button>
        </template>
        <el-descriptions-item label="Designation">
          <DescriptionTooltip value="web developer" />
        </el-descriptions-item>
        <el-descriptions-item label="Telephone">
          <DescriptionTooltip value="617 219 6245" />
        </el-descriptions-item>
        <el-descriptions-item label="Birth of Date">
          <DescriptionTooltip value="24 June, 1998" />
        </el-descriptions-item>
        <el-descriptions-item label="Remard">
          <el-tag size="small">School</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="Website">
          <a href="http://themesbrand.com/" target="_blank">
            www.themesbrand.com
          </a>
        </el-descriptions-item>
        <el-descriptions-item label="Email">
          <DescriptionTooltip value="richardmarshall@steex.com" />
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">Joining Date</div>
          </template>
          30 Oct 2023
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">Location</div>
          </template>
          Los Angeles, California
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <el-divider />
    <div>
      <el-descriptions class="" title="Documents" :column="1" size="small">
        <template #extra>
          <el-button size="small" type="primary">Download All</el-button>
        </template>
        <el-descriptions-item label="None" class="" />
      </el-descriptions>
    </div>
    <el-divider />
    <div>
      <h4>OVERVIEW</h4>
      <div class="mt-1">Task Compiled: 13.5k</div>
      <div class="mt-1">Projects Compiled:146</div>
      <div class="mt-1">Connections:897</div>
    </div>
  </el-card>
</template>
