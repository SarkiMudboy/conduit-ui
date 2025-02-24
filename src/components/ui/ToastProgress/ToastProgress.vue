<script setup lang="ts">
import Progress from '@/components/ui/progress/Progress.vue';
import { watch } from 'vue';

//const props = defineProps<{ progress: number }>();
const props = defineProps(['progress'])
console.log(props.progress.value)
//watch(() => props.progress, () => {
//  console.log(props.progress)
//});
</script>

<template>
  <Progress :progress="props.progress" class="mt-2" />
</template>
