<template>
  <div class="pt-[85px] lg:pt-0 bg-white text-black">
    <Wrapper class="py-8">
      <!-- Breadcrumb -->
      <nav class="flex items-center text-sm text-[#787878] space-x-2 mb-8 p-4 bg-[#f8f8f8] rounded-lg">
        <router-link to="/" class="flex items-center hover:text-black transition-colors duration-200 font-srProDisplay font-medium">
          Home
        </router-link>
        <span class="text-[#CCCCCC] font-srProDisplay">></span>
        <span class="text-black font-srProDisplay font-medium">About</span>
      </nav>
      <!-- Hero Section -->
      <section class="max-w-4xl mx-auto text-center mb-16">
        <h1 class="font-srProDisplay text-5xl font-medium mb-6 text-black">About Us</h1>
        <p class="font-srProDisplay text-lg text-[#787878] mb-8 leading-relaxed">
          Somos una tienda de comercio electrónico dedicada a ofrecer productos de alta calidad con un enfoque minimalista y elegante. Nuestra misión es proporcionar una experiencia de compra sencilla y agradable para todos nuestros clientes.
        </p>
      </section>

      <!-- Values Section -->
      <section class="max-w-6xl mx-auto mb-16">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Quality -->
          <div class="text-center p-6">
            <div class="w-16 h-16 mx-auto mb-4 bg-[#f6f6f6] rounded-full flex items-center justify-center">
              <v-icon name="hi-badge-check" class="w-8 h-8 text-black" />
            </div>
            <h3 class="font-srProDisplay text-xl font-medium mb-3 text-black">Quality</h3>
            <p class="font-srProDisplay text-[#787878] leading-relaxed">
              Productos cuidadosamente seleccionados que cumplen con los más altos estándares de calidad.
            </p>
          </div>

          <!-- Innovation -->
          <div class="text-center p-6">
            <div class="w-16 h-16 mx-auto mb-4 bg-[#f6f6f6] rounded-full flex items-center justify-center">
              <v-icon name="gi-smartphone" class="w-8 h-8 text-black" />
            </div>
            <h3 class="font-srProDisplay text-xl font-medium mb-3 text-black">Innovation</h3>
            <p class="font-srProDisplay text-[#787878] leading-relaxed">
              Las últimas tecnologías y tendencias en dispositivos electrónicos y accesorios.
            </p>
          </div>

          <!-- Support -->
          <div class="text-center p-6">
            <div class="w-16 h-16 mx-auto mb-4 bg-[#f6f6f6] rounded-full flex items-center justify-center">
              <v-icon name="hi-users" class="w-8 h-8 text-black" />
            </div>
            <h3 class="font-srProDisplay text-xl font-medium mb-3 text-black">Support</h3>
            <p class="font-srProDisplay text-[#787878] leading-relaxed">
              Atención al cliente excepcional para garantizar una experiencia de compra perfecta.
            </p>
          </div>
        </div>
      </section>

      <!-- Featured Products Section -->
      <section class="max-w-6xl mx-auto mb-16">
        <h2 class="font-srProDisplay text-3xl font-medium text-center mb-12 text-black">Our Featured Products</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- iPhone -->
          <div class="bg-[#f6f6f6] rounded-[15px] p-8 text-center hover:shadow-lg transition-shadow duration-300">
            <div class="h-32 w-full flex items-center justify-center mb-6">
              <img src="/images/Apple-phone.png" alt="iPhone" class="h-full object-contain" />
            </div>
            <h3 class="font-srProDisplay text-lg font-medium mb-2 text-black">iPhone 14 Pro</h3>
            <p class="font-srProDisplay text-[#787878] text-sm">Premium smartphone experience</p>
          </div>

          <!-- MacBook -->
          <div class="bg-[#f6f6f6] rounded-[15px] p-8 text-center hover:shadow-lg transition-shadow duration-300">
            <div class="h-32 w-full flex items-center justify-center mb-6">
              <img src="/images/Macbook.png" alt="MacBook" class="h-full object-contain" />
            </div>
            <h3 class="font-srProDisplay text-lg font-medium mb-2 text-black">MacBook Pro</h3>
            <p class="font-srProDisplay text-[#787878] text-sm">Professional computing power</p>
          </div>

          <!-- AirPods -->
          <div class="bg-[#f6f6f6] rounded-[15px] p-8 text-center hover:shadow-lg transition-shadow duration-300">
            <div class="h-32 w-full flex items-center justify-center mb-6">
              <img src="/images/Apple-airPods.png" alt="AirPods" class="h-full object-contain" />
            </div>
            <h3 class="font-srProDisplay text-lg font-medium mb-2 text-black">AirPods Pro</h3>
            <p class="font-srProDisplay text-[#787878] text-sm">Wireless audio excellence</p>
          </div>
        </div>
      </section>

      <!-- Contact CTA -->
      <section class="max-w-4xl mx-auto text-center bg-[#2E2E2E] rounded-[15px] p-12">
        <h2 class="font-srProDisplay text-3xl font-medium mb-4 text-white">Ready to Shop?</h2>
        <p class="font-srProDisplay text-[#CCCCCC] mb-8 leading-relaxed">
          Descubre nuestra colección completa de productos premium y encuentra el dispositivo perfecto para ti.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            text-color="black"
            bg-color="white"
            border-width="1px"
            border-color="white"
            hover-bg-color="#f0f0f0"
            hover-text-color="black"
            width="160px"
            height="48px"
            @click="goToProducts"
          >
            Shop Now
          </Button>
          <Button
            text-color="white"
            bg-color="transparent"
            border-width="1px"
            border-color="white"
            hover-bg-color="white"
            hover-text-color="black"
            width="160px"
            height="48px"
            @click="contactUs"
          >
            Contact Us
          </Button>
        </div>
      </section>
    </Wrapper>
  </div>
</template>

<script setup lang="ts">
import Wrapper from '@/components/shared/Wrapper.vue'
import Button from '@/components/shared/Button.vue'
// Removed unused router import

const learnMore = () => {
  // Acción de ejemplo: redirigir a sección de contacto o scroll
}

const goToProducts = () => {
  // Navegar a la página de productos
  console.log('Navigate to products')
}

const contactUs = () => {
  // Acción de contacto
  console.log('Contact us action')
}
</script>
