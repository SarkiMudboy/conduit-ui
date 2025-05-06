<script setup lang="ts">
import { Box, Database, Folder, FolderSync } from 'lucide-vue-next';
const features = [
  {
    title: "Private & Shared Drives",
    description: "Keep files organized with personal storage for yourself and shared drives to collaborate with friends.",
    icon: Box,
  },
  {
    title: "Generous Free Storage",
    description: "Start with 5GB of personal space and 10GB of shared storage—completely free on sign up.",
    icon: Database,
  },
  {
    title: "Fast & Secure Transfers",
    description: "Files are uploaded and accessed using pre-signed S3 URLs for fast, secure file transfers.",
    icon: FolderSync,
  },
  {
    title: "Folder Uploads & Zip Downloads",
    description: "Upload entire folders and download them as ZIP files directly on your device—no server compression needed.",
    icon: Folder,
  },
]
</script>


<template>
  <section id="features" class="w-full py-12 md:py-24 lg:py-32 bg-white">
    <div class="container px-4 md:px-6">
      <h2 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">Key Features</h2>
      <div class="grid grid-cols-1 mt-20 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div v-for="(feature, index) in features" :key="index"
          class="flex flex-col items-center text-center p-12  rounded-md shadow-md">
          <component :is="feature.icon" class="h-12 w-12 mb-4 text-purple-600" />
          <h3 class="text-xl font-bold mb-2">{{ feature.title }}</h3>
          <p class="text-gray-600">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
