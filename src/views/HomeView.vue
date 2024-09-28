<script setup lang="ts">
import CustomHeader from '@/components/CustomHeader.vue'
</script>

<template>
  <CustomHeader>
    <RouterLink to="/"> Home </RouterLink>
    <RouterLink to="/login"> Login </RouterLink>
    <RouterLink to="/sign-up"> Sign Up </RouterLink>
  </CustomHeader>
  <div class="container p-10">
    <p>Welcome to Conduit</p>
  </div>
</template>

<style></style>
