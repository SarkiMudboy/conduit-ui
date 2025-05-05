<script setup lang="ts">
import ThemeToggle from './theme/ThemeToggle.vue'
import Button from './ui/button/Button.vue';
</script>
<template>

  <header class="w-full px-4 lg:px-6 h-20 flex items-center justify-between">
    <RouterLink to="/" class="flex items-center space-x-2">
      <span class="text-2xl font-bold font-inter text-gray-900">ConduitX</span>
    </RouterLink>
    <nav class="hidden md:flex space-x-8 lg:space-x-12">
      <RouterLink to="#features" class="text-sm font-semibold text-gray-700 hover:text-gray-900">
        Features
      </RouterLink>
      <RouterLink to="#demo" class="text-sm font-semibold text-gray-700 hover:text-gray-900">
        Demo
      </RouterLink>
      <RouterLink to="#use-cases" class="text-sm font-semibold text-gray-700 hover:text-gray-900">
        Use Cases
      </RouterLink>
    </nav>
    <div class="flex items-center gap-4 justify-between">
      <ThemeToggle />
      <Button>
        <RouterLink to="/login"> Login </RouterLink>
      </Button>
      <Button>
        <RouterLink to="/sign-up"> Sign Up </RouterLink>
      </Button>
    </div>
  </header>
</template>
