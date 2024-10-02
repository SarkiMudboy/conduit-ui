<script setup lang="ts">
import { User, Users, Circle } from 'lucide-vue-next'
// import Button from './ui/button/Button.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const drive = defineProps({
  resource: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <Card @click="$emit('selectedObject', drive.resource.uid, 'drive')" class="hover:bg-muted">
    <CardHeader class="grid grid-cols-[minmax(0,1fr)_110px] items-start gap-4 space-y-0">
      <div class="space-y-1">
        <CardTitle>{{ drive.resource.name }}</CardTitle>
        <CardDescription> This is a space or storage box for your files. </CardDescription>
      </div>
    </CardHeader>
    <CardContent>
      <div class="flex space-x-4 text-sm text-muted-foreground">
        <div class="flex items-center">
          <User
            v-if="drive.resource.type == 'personal'"
            :size="30"
            :stroke-width="0.7"
            class="mr-1 h-3 w-3 text-grey-400"
          />
          <Users v-else :size="30" :stroke-width="0.7" class="mr-1 h-3 w-3 text-grey-400" />
          {{ drive.resource.type }}
        </div>
        <div class="flex items-center">
          <Circle :size="20" :stroke-width="0.5" class="mr-1 h-3 w-3 text-grey-400" />
          {{ Math.round(drive.resource.used) }}/5 (GB)
        </div>
        <div>Updated April 2023</div>
      </div>
    </CardContent>
  </Card>
</template>
