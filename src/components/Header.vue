<script setup lang="ts">
import Button from './ui/button/Button.vue';
import { Database } from 'lucide-vue-next';
</script>
<template>

  <header class="w-full px-4 lg:px-6 h-20 flex items-center justify-between bg-transparent">
    <RouterLink to="/" class="flex items-center space-x-2">
      <span class="text-2xl font-bold font-inter text-gray-900 dark:text-white">Conduit</span><span>
        <Database />
      </span>
    </RouterLink>
    <slot></slot>
    <div class="flex items-center gap-4 justify-between">
      <Button class="font-semibold">
        <RouterLink to="/login"> Login </RouterLink>
      </Button>
      <Button variant="outline" class="font-semibold">
        <RouterLink to="/sign-up"> Sign Up </RouterLink>
      </Button>
    </div>
  </header>
</template>
