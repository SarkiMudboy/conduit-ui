<script setup lang="ts">
import { HardDrive, Mail, Database } from 'lucide-vue-next';
import NavItem from './NavItem.vue';
</script>

<template>

  <div class="w-64 min-w-64 border-r">
    <div class="flex flex-row gap-2 p-4">
      <h1 class="text-xl font-bold">conduit </h1>
      <span class="mt-1">
        <Database />
      </span>
    </div>
    <nav class="space-y-1 px-2">
      <div class="py-3 px-3 mt-3 text-xs font-medium uppercase text-gray-500">File Manager</div>
      <NavItem href="/files" :icon="HardDrive" :active="true">
        Drives
      </NavItem>
      <NavItem href="/inbox" :icon="Mail">
        Inbox
      </NavItem>
    </nav>
  </div>

</template>
