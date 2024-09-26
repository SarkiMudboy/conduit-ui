<script setup lang="ts"></script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <div class="container">01</div>
    <div class="container">02</div>
  </div>
</template>
<!-- this will in its created lifecycle hook try to get the drives, if it fails (like 404): re-route to login -->
