<script setup lang="ts">
import { type Drive } from './types';
import { Box } from 'lucide-vue-next';
import { UserRound, Users, ArrowRight, Calendar } from 'lucide-vue-next';
import { calculateDiskUsage, cn } from '@/lib/utils';
import { calculateFileSize } from '@/lib/utils';

const drive = defineProps<Drive>();
const emit = defineEmits<{
  (e: 'drive-selected', uid: string): void
}>()

const statusConfig = {
  personal: {
    icon: UserRound,
    class: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
  },
  shared: {
    icon: Users,
    class: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
}


const getDriveCreatedDate = (dateString: string) => {
  const date = new Date(dateString)
  return `${date.toDateString()}`
}
</script>

<template>
  <div :class="cn('flex flex-col', 'w-[280px] shrink-0', 'bg-white dark:bg-zinc-900/70', 'rounded-xl'
    , 'border border-zinc-300 dark:border-zinc-800', 'hover:border-zinc-200 dark:hover:border-zinc-700'
    , 'transition-all duration-200', 'shadow-sm backdrop-blur-xl')">
    <div class="p-4 space-y-3">
      <div class="flex items-start justify-between">
        <div class="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
          <Box class=" w-4 h-4" />
        </div>
        <div
          :class="cn('px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1.5', statusConfig[drive.type].bg, statusConfig[drive.type].class)">
          <component :is="statusConfig[drive.type].icon" class="w-3.5 h-3.5" />
          {{ drive.type }}
        </div>
      </div>

      <div>
        <h3 class="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">{{ drive.name }}</h3>
        <p class="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2"> This is my safe space for files of course
        </p>
      </div>

      <div class="space-y-1.5">
        <div class="flex items-center justify-between text-xs">
          <span class="text-zinc-600 dark:text-zinc-400">Usage</span>
          <span class="text-zinc-900 dark:text-zinc-100">{{ calculateFileSize(drive.used) }}/{{
            calculateFileSize(drive.size) }}</span>
        </div>
        <div class="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div class="h-full bg-zinc-900 dark:bg-zinc-100 rounded-full"
            :style="{ width: calculateDiskUsage(drive.used, drive.size) + '%' }" />
        </div>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="text-sm font-medium text-zinc-900 dark:text-zinc-100">mem1, mem2, mem3</span>
        <span class="text-xs text-zinc-600 dark:text-zinc-400">members</span>
      </div>
      <div class="flex items-center text-xs text-zinc-600 dark:text-zinc-400">
        <Calendar class="w-3.5 h-3.5 mr-1.5" />
        <span>{{ getDriveCreatedDate(drive.created_at) }}</span>
      </div>
    </div>

    <div class="mt-auto border-t border-zinc-100 dark:border-zinc-800">
      <button :class="cn('w-full flex items-center justify-center gap-2', 'py-2.5 px-3', 'text-xs font-medium'
        , 'text-zinc-600 dark:text-zinc-400', 'hover:text-zinc-900 dark:hover:text-zinc-100'
        , 'hover:bg-zinc-100 dark:hover:bg-zinc-800/50', 'transition-colors duration-200')"
        @click="emit('drive-selected', drive.uid)">
        View
        <ArrowRight class="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
</template>
