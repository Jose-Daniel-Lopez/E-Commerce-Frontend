<template>
  <nav class="w-full h-14 bg-[#2E2E2E] flex items-center">
    <div class="flex items-center h-full w-full">
      <!-- Phones -->
      <div class="flex items-center justify-center flex-1 h-full px-1 cursor-pointer hover:bg-[#404040] transition-colors" @click="navigateToCategory('phones')">
        <div class="flex flex-col items-center gap-0.5">
          <v-icon
            name="gi-smartphone"
            scale="1.4"
            class="opacity-50 pt-1 pb-0.5 text-white"
          />
          <span class="text-white text-sm opacity-50 font-medium">Moviles</span>
        </div>
      </div>

      <!-- Separator -->
      <div class="h-6 w-px bg-white opacity-20"></div>

      <!-- Computers -->
      <div class="flex items-center justify-center flex-1 h-full px-1 cursor-pointer hover:bg-[#404040] transition-colors" @click="navigateToCategory('computers')">
        <div class="flex flex-col items-center gap-0.5">
          <v-icon
            name="bi-laptop"
            scale="1.4"
            class="opacity-50 pt-1 pb-0.5 text-white"
          />
          <span class="text-white text-sm opacity-50 font-medium">Ordenadores</span>
        </div>
      </div>

      <!-- Separator -->
      <div class="h-6 w-px bg-white opacity-20"></div>

      <!-- Smart Watches -->
      <div class="flex items-center justify-center flex-1 h-full px-1 cursor-pointer hover:bg-[#404040] transition-colors" @click="navigateToCategory('smart-watches')">
        <div class="flex flex-col items-center gap-0.5">
          <v-icon
            name="bi-smartwatch"
            scale="1.4"
            class="opacity-50 pt-1 pb-0.5 text-white"
          />
          <span class="text-white text-sm opacity-50 font-medium">Relojes Inteligentes</span>
        </div>
      </div>

      <!-- Separator -->
      <div class="h-6 w-px bg-white opacity-20"></div>

      <!-- Cameras -->
      <div class="flex items-center justify-center flex-1 h-full px-1 cursor-pointer hover:bg-[#404040] transition-colors" @click="navigateToCategory('cameras')">
        <div class="flex flex-col items-center gap-0.5">
          <v-icon
            name="bi-camera"
            scale="1.4"
            class="opacity-50 pt-1 pb-0.5 text-white"
          />
          <span class="text-white text-sm opacity-50 font-medium">Camaras</span>
        </div>
      </div>

      <!-- Separator -->
      <div class="h-6 w-px bg-white opacity-20"></div>

      <!-- Headphones -->
      <div class="flex items-center justify-center flex-1 h-full px-1 cursor-pointer hover:bg-[#404040] transition-colors" @click="navigateToCategory('headphones')">
        <div class="flex flex-col items-center gap-0.5">
          <v-icon
            name="la-headphones-solid"
            scale="1.4"
            class="opacity-50 pt-1 pb-0.5 text-white"
          />
          <span class="text-white text-sm opacity-50 font-medium">Auriculares</span>
        </div>
      </div>

      <!-- Separator -->
      <div class="h-6 w-px bg-white opacity-20"></div>

      <!-- Gaming -->
      <div class="flex items-center justify-center flex-1 h-full px-1 cursor-pointer hover:bg-[#404040] transition-colors" @click="navigateToCategory('gaming')">
        <div class="flex flex-col items-center gap-0.5">
          <v-icon
            name="gi-console-controller"
            scale="1.4"
            class="opacity-50 pt-1 pb-0.5 text-white"
          />
          <span class="text-white text-sm opacity-50 font-medium">Videojuegos</span>
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'SubnavBar',
  setup() {
    const router = useRouter();

    const navigateToCategory = (categorySlug: string) => {
      router.push(`/category/${categorySlug}`);
    };

    return {
      navigateToCategory
    };
  }
});
</script>

<style scoped>
.font-medium {
  font-weight: 500;
}
</style>
