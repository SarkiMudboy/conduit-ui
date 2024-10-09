<script setup lang="ts">
import ThemeToggle from './theme/ThemeToggle.vue'
</script>
<template>
  <header class="flex flex-row justify-between m-5">
    <nav class="text-xl font-medium text-black dark:text-white">
      <slot />
    </nav>
    <ThemeToggle />
  </header>
</template>
