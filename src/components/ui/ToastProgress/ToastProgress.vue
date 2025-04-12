<script setup lang="ts">
import Progress from '@/components/ui/progress/Progress.vue';

const props = defineProps(['progress'])
</script>

<template>
  <Progress class="[&>*]:bg-purple-500" :model-value="props.progress.value" />
</template>
