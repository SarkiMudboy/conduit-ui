<script setup lang="ts">
import Badge from '@/components/ui/badge/Badge.vue';

const props = defineProps<{ isNew: boolean }>();

</script>
<template>
  <div class="relative inline-block">
    <slot />
    <div v-if="props.isNew" class="absolute top-3 right-10 h-5 w-5 rounded-full z-10 bg-red-500"></div>
  </div>
</template>
