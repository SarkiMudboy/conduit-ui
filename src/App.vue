<script setup lang="ts"></script>

<template>
  <header>
    <nav class="text-xl font-medium text-black">
      <RouterLink to="/"> Home </RouterLink>
      <RouterLink to="/login"> Login </RouterLink>
      <RouterLink to="/sign-up"> Sign Up </RouterLink>
    </nav>
  </header>
  <Suspense>
    <RouterView />
    <template #fallback>
      <p class="text-2xl">Loading...</p>
    </template>
  </Suspense>
</template>

<style></style>
