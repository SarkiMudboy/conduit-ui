<script setup lang="ts">
import SideBar from '@/views/SideBar/SideBar.vue';
//import { defineComponent, type Component } from 'vue';
//
//const props = defineProps<{
//  component: Component
//}>();
//
</script>

<template>
  <div className="flex h-screen">
    <SideBar />
    <router-view></router-view>
  </div>
</template>
