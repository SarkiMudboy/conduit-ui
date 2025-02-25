<script setup lang="ts">
import Progress from '@/components/ui/progress/Progress.vue';

const props = defineProps(['progress'])
</script>

<template>
  <Progress :model-value="props.progress.value" />
</template>
