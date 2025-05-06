<script setup lang="ts">

const testimonials = [
  {
    quote: "Conduit saved me tons of time finding and tracking files with colleauges, We have a more organized file storage now",
    author: "Jane Doe",
    position: "CTO, Tech Innovators Inc.",
  },
  {
    quote: "I store my personal stuff securely on my personal drives now",
    author: "John Smith",
    position: "Lead Researcher, Global Institute",
  },
]

</script>
<template>
  <section class="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
    <div class="container px-4 md:px-6">
      <h2 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
        What Our Users Say
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">

        <div v-for="(testimonial, index) in testimonials" :key="index" class="bg-white p-6 rounded-lg shadow-md">
          <p class="text-gray-600 italic mb-4">{{ testimonial.quote }}</p>
          <p class="font-bold">{{ testimonial.author }}</p>
          <p class="text-sm text-gray-500">{{ testimonial.position }}</p>
        </div>
      </div>
    </div>
  </section>

</template>
