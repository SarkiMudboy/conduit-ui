<script setup lang="ts">
import SideBar from '@/views/SideBar/SideBar.vue';
</script>

<template>
  <div className="flex h-screen">
    <SideBar />
    <router-view></router-view>
  </div>
</template>
