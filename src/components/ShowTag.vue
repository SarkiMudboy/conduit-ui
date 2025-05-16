<script setup lang="ts">
import router from '@/router';
import { AddAnimationEffectToElementOnLoad } from '@/lib/utils';
import { onMounted } from 'vue';
const props = defineProps<{ userTag: string }>();

onMounted(() => {
  AddAnimationEffectToElementOnLoad('fadeIn')
})

//setTimeout(() => {
//  router.push("/files")
//}, 5000)

</script>


<template>
  <div class="relative h-[100vh]">
    <div class="absolute inset-0 bg-gradient-to-b from-blue-50 to-blue-100 blur-sm"></div>
    <section class="relative flex flex-col h-full items-center justify-center gap-2">
      <h1 class="text-[6vmin] font-bold text-gray-700">Hey, {{
        props.userTag }} <span class="animate-pulse">🎊</span> </h1>
      <p class="text-xl font-mono">You can share files with friends using their tags!</p>
      <p class="font-medium">You'll be redirected in 5s</p>
    </section>
  </div>
</template>
