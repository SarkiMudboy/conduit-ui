<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
</script>

<template>
  <section class="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-blue-100 via-white to-purple-100">
    <div class="container px-4 md:px-6">
      <div class="flex flex-col items-center space-y-4 text-center">
        <h1 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
          Share and Store Files without Hassle
        </h1>
        <p class="mx-auto max-w-[700px] text-gray-700 md:text-xl">
          Unlock flexible storage solutions and fluid file sharing among your friends and colleagues.
        </p>
        <Button size="lg" class="mt-6 px-12 font-semibold">
          Get Started
        </Button>
      </div>
    </div>
  </section>
</template>
