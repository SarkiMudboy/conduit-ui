<script setup lang="ts">
import ThemeToggle from './theme/ThemeToggle.vue'
import Button from './ui/button/Button.vue';
</script>
<template>

  <header class="w-full px-4 lg:px-6 h-20 flex items-center justify-between">
    <RouterLink to="/" class="flex items-center space-x-2">
      <span class="text-2xl font-bold font-inter text-gray-900">ConduitX</span>
    </RouterLink>
    <slot></slot>
    <div class="flex items-center gap-4 justify-between">
      <ThemeToggle />
      <Button class="font-semibold">
        <RouterLink to="/login"> Login </RouterLink>
      </Button>
      <Button variant="outline" class="font-semibold">
        <RouterLink to="/sign-up"> Sign Up </RouterLink>
      </Button>
    </div>
  </header>
</template>
