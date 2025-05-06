<script setup lang="ts">
import { Button } from "@/components/ui/button"
</script>
<template>
  <section class="w-full py-12 md:py-24 lg:py-32 bg-purple-400 text-white">
    <div class="container px-4 md:px-6 text-center">
      <h2 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
        Ready to simplify file sharing and storage?
      </h2>
      <p class="mx-auto max-w-[700px] text-lg mb-8">
        Start Organizing, Storing and Sharing files with conduit now, Don't Sleep on it!
      </p>
      <Button size="lg" variant="secondary" class="font-semibold">
        <RouterLink to="/sign-up">Try Conduit Free</RouterLink>
      </Button>
    </div>
  </section>
</template>
