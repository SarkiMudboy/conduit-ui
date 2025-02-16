<script setup lang="ts">
import { type Component } from 'vue';
import { cn } from '@/lib/utils';
import { RouterLink } from 'vue-router';

interface NavItemProps {
  href: string,
  icon: Component,
  active?: boolean
}

const props = defineProps<NavItemProps>();
</script>

<template>
  <RouterLink to="props.href"
    :class="cn('flex items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-lg transition-colors dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#1F1F23]', active && 'bg-gray-100 dark:bg-gray-700')">
    <component :is="props.icon" class="h-5 w-5"></component>
    <span>
      <slot></slot>
    </span>
  </RouterLink>
</template>
