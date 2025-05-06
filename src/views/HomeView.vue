<script setup lang="ts">
import CTA from '@/components/CTA.vue';
import Features from '@/components/Features.vue';
import Header from '@/components/Header.vue'
import Hero from '@/components/Hero.vue'
import NavBar from '@/components/NavBar.vue';
import Testimonials from '@/components/Testimonials.vue';
import Footer from '@/components/Footer.vue';
</script>

<template>
  <main class="flex min-h-screen flex-col items-center">
    <Header>
      <NavBar />
    </Header>
    <Hero />
    <Features />
    <Testimonials />
    <CTA />
    <Footer />
  </main>
</template>
