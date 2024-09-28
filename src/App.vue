<script setup lang="ts"></script>

<template>
  <Suspense>
    <RouterView />
    <template #fallback>
      <p class="text-2xl">Loading...</p>
    </template>
  </Suspense>
</template>

<style></style>
