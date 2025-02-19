<script lang="ts" setup>
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Slash } from 'lucide-vue-next'
</script>

<template>
  <div class="flex flex-row justify-between">
    <Breadcrumb class="my-5">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink class="font-bold font-mono text-lg" href="/files">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink class="font-bold font-mono text-lg" href="/files">
            Components
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage class="font-bold font-mono text-lg">Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <slot />
  </div>
</template>
