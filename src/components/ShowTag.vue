<script setup lang="ts">
import router from '@/router';
import { AddAnimationEffectToElementOnLoad } from '@/lib/utils';
import { onMounted } from 'vue';
const props = defineProps<{ userTag: string }>();

onMounted(() => {
  AddAnimationEffectToElementOnLoad('fadeIn')
})

setTimeout(() => {
  router.push("/files")
}, 5000)

</script>


<template>
  <div class="relative flex flex-col items-center justify-center h-[100vh]">
    <div class="absolute inset-0  bg-gradient-to-b from-white to-purple-200"></div>
    <section class="relative flex flex-col items-center justify-center gap-2">
      <h1 class="text-[6vmin] font-bold text-gray-700">Hey, {{ props.userTag }} <span class="animate-pulse">🎊</span>
      </h1>
      <p class="text-xl font-mono">You can share files with friends using their tags!</p>
    </section>
    <p class="relative mt-8 font-mono">You'll be redirected in a jiffy...</p>
  </div>
</template>
