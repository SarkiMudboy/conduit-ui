<script setup lang="ts">
import { inject } from 'vue'

const $confetti = inject('confetti')

const start = () => {
  $confetti?.start()
}

const stop = () => {
  $confetti?.stop()
}

const love = () => {
  $confetti?.update({
    particles: [
      { type: 'heart' },
      { type: 'circle' },
    ],
    defaultColors: ['red', 'pink', '#ba0000'],
  })
}
</script>
<template>
  <main>
    <button @click="start">Start</button>
    <button @click="stop">Stop</button>
    <button @click="love">Show Some Love</button>
  </main>
</template>
