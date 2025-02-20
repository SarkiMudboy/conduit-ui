<script setup lang="ts">

import Button from '@/components/ui/button/Button.vue';
</script>


<template>
  <div class="mb-6 flex items-center gap-4">
    <slot></slot>
    <Button variant="outline" class="gap-2">
      <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" strokeWidth="2" strokeLinecap="round"
          strokeLinejoin="round" />
      </svg>
      Upload
    </Button>
    <Button variant="outline" class="gap-2">
      <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Create folder
    </Button>
    <Button variant="outline" class="gap-2">
      <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M12 18.5a6.5 6.5 0 100-13 6.5 6.5 0 000 13zM12 14a2 2 0 100-4 2 2 0 000 4z" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Record
    </Button>
  </div>
</template>
