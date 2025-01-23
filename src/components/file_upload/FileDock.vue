<script setup lang="ts">
import { Card } from '@/components/ui/card';
import FileIcon from '@/components/icons/FileIcon.vue';
import { Progress } from '@/components/ui/progress'
import { ref } from 'vue';
import { X } from 'lucide-vue-next';

const props = defineProps({
  file: {
    type: File,
    required: true
  }
})
const progress = ref(0);

const emit = defineEmits<{ (e: 'remove-file', name: string): void }>();

</script>

<template>
  <Card class="flex flex-row h-18 mt-5 items-center">
    <div class="m-4 w-5/6 space-y-2">
      <p class="flex flex-row gap-x-2">
        <span>
          <FileIcon :stroke-width="1" />
        </span> {{ props.file.name }}
      </p>
      <Progress v-model="progress" class="[&>*]:bg-green-600 h-2 w-full" />
    </div>
    <span class="opacity-70 border border-gray-500 rounded-sm hover:bg-accent hover:ring-2">
      <X @click="emit('remove-file', props.file.name)" class="w-4 h-4  " />
    </span>
  </Card>
</template>
