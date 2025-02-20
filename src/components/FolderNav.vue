<script lang="ts" setup>
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useFileTreeContextStore, type ObjectNode } from '@/stores/fileTreeContextStore';
import { Slash } from 'lucide-vue-next'
import { computed } from 'vue';

const filePathNav = useFileTreeContextStore()

const fileTreeContext = computed(() => {
  return filePathNav.filePath
})

const emit = defineEmits<{ (e: 'node-selected', node: string | ObjectNode): void }>();

const verifyNode = (node: ObjectNode) => {
  const source = fileTreeContext.value.indexOf(node) == 0 ? node.uid : node
  emit('node-selected', source)
}

</script>

<template>
  <div class="flex flex-row justify-between">
    <Breadcrumb class="my-5">
      <BreadcrumbList>
        <BreadcrumbItem v-for="file in fileTreeContext" :key="file.uid" class="cursor-pointer">
          <BreadcrumbLink v-if="fileTreeContext.indexOf(file) !== fileTreeContext.length - 1"
            class="font-bold font-mono text-lg" @click="verifyNode(file)">
            {{ file.name }}
          </BreadcrumbLink>
          <BreadcrumbPage v-else class="font-bold font-mono text-lg">{{ file.name }}</BreadcrumbPage>
          <BreadcrumbSeparator v-if="fileTreeContext.indexOf(file) !== fileTreeContext.length - 1">
            <Slash />
          </BreadcrumbSeparator>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <slot />
  </div>
</template>
