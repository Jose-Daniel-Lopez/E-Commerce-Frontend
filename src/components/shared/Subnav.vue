<template>
  <nav class="w-full h-12 bg-[#2E2E2E] flex items-center">
    <div class="flex items-center h-full w-full">
      <!-- Phones -->
      <div class="flex items-center justify-center flex-1 h-full px-1 cursor-pointer hover:bg-[#404040] transition-colors" @click="navigateToCategory('phones')">
        <div class="flex flex-col items-center gap-0.5">
          <svg width="16" height="20" viewBox="0 0 16 20" fill="none" class="opacity-50 pt-1 pb-0.5">
            <path d="M3.312 1.625H12.688V1.625C12.782 1.625 12.859 1.702 12.859 1.7969V18.2031C12.859 18.298 12.782 18.375 12.688 18.375H3.312C3.218 18.375 3.141 18.298 3.141 18.2031V1.7969C3.141 1.702 3.218 1.625 3.312 1.625Z" stroke="white" stroke-width="2"/>
            <path d="M7 2H9.344V2" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <path d="M7 16.8594V16.8702" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <path d="M2.5 15.5H13.5" stroke="white" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span class="text-white text-sm opacity-50 font-medium">Phones</span>
        </div>
      </div>

      <!-- Separator -->
      <div class="h-6 w-px bg-white opacity-20"></div>

      <!-- Computers -->
      <div class="flex items-center justify-center flex-1 h-full px-1 cursor-pointer hover:bg-[#404040] transition-colors" @click="navigateToCategory('computers')">
        <div class="flex flex-col items-center gap-0.5">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" class="opacity-50 pt-1 pb-0.5">
            <path d="M4 18H14M6 14V18M12 14V18M0.429 11.7143H17.571M1 2H17C17.552 2 18 2.4477 18 3V13C18 13.5523 17.552 14 17 14H1C0.448 14 0 13.5523 0 13V3C0 2.4477 0.448 2 1 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="text-white text-sm opacity-50 font-medium">Computers</span>
        </div>
      </div>

      <!-- Separator -->
      <div class="h-6 w-px bg-white opacity-20"></div>

      <!-- Smart Watches -->
      <div class="flex items-center justify-center flex-1 h-full px-1 cursor-pointer hover:bg-[#404040] transition-colors" @click="navigateToCategory('smart-watches')">
        <div class="flex flex-col items-center gap-0.5">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="opacity-50 pt-1 pb-0.5">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M16.7067 4.45778L16.3922 3.51415C16.2545 3.0999 16.1292 2.72278 15.8316 2.32848C15.7013 2.15578 15.529 1.98999 15.3812 1.86358C15.2335 1.73717 15.0431 1.59256 14.8523 1.49049C14.4187 1.25849 14.1138 1.20729 13.7658 1.14885L13.7464 1.14559C13.2521 1.06252 12.661 1 12 1C11.339 1 10.7479 1.06252 10.2536 1.14559L10.2342 1.14885C9.88624 1.20729 9.58131 1.25849 9.14769 1.49049C8.95692 1.59256 8.76649 1.73717 8.61875 1.86358C8.47102 1.98999 8.29872 2.15578 8.16838 2.32848C7.8708 2.72278 7.74548 3.0999 7.60781 3.51416L7.29332 4.45778C7.2835 4.46275 7.2737 4.46778 7.26391 4.47286C6.49681 4.87134 5.87134 5.49681 5.47286 6.26391C5.20622 6.77722 5.09873 7.32713 5.04847 7.93238C4.99998 8.51625 4.99999 9.23444 5 10.1096V13.8904C4.99999 14.7655 4.99998 15.4838 5.04847 16.0676C5.09873 16.6729 5.20622 17.2228 5.47286 17.7361C5.87134 18.5032 6.49681 19.1287 7.26391 19.5271L7.29331 19.5422L7.60781 20.4858C7.74548 20.9001 7.8708 21.2772 8.16838 21.6715C8.29872 21.8442 8.47102 22.01 8.61875 22.1364C8.76649 22.2628 8.95692 22.4074 9.14769 22.5095C9.58131 22.7415 9.88624 22.7927 10.2342 22.8511L10.2536 22.8544C10.7479 22.9375 11.339 23 12 23C12.661 23 13.2521 22.9375 13.7464 22.8544L13.7658 22.8511C14.1138 22.7927 14.4187 22.7415 14.8523 22.5095C15.0431 22.4074 15.2335 22.2628 15.3812 22.1364C15.529 22.01 15.7013 21.8442 15.8316 21.6715C16.1292 21.2772 16.2545 20.9001 16.3922 20.4858L16.7067 19.5422L16.7361 19.5271C17.5032 19.1287 18.1287 18.5032 18.5271 17.7361C18.7938 17.2228 18.9013 16.6729 18.9515 16.0676C19 15.4838 19 14.7656 19 13.8905V11.5C19.5523 11.5 20 11.0523 20 10.5V8.5C20 7.94771 19.5523 7.5 19 7.5C18.9676 7.5 18.9355 7.50154 18.9039 7.50456C18.8403 7.06445 18.7296 6.65363 18.5271 6.26391C18.1287 5.49681 17.5032 4.87134 16.7361 4.47286C16.7263 4.46778 16.7165 4.46275 16.7067 4.45778ZM13.4149 3.11793C13.0151 3.05073 12.5356 3 12 3C11.4644 3 10.9849 3.05073 10.5851 3.11793C10.2599 3.1726 10.2273 3.18112 10.0912 3.25395C10.0912 3.25394 10.0913 3.2539 10.0912 3.25395C10.0896 3.25489 10.0707 3.26575 10.0356 3.29105C10.0008 3.31612 9.96045 3.34777 9.91906 3.38319C9.87767 3.4186 9.84017 3.45354 9.81002 3.48407C9.77954 3.51493 9.76599 3.53177 9.76484 3.53319C9.76477 3.53327 9.76482 3.53321 9.76484 3.53319C9.695 3.62573 9.66038 3.69187 9.54989 4.01473C10.0034 3.99998 10.521 3.99999 11.1096 4H12.8904C13.479 3.99999 13.9966 3.99998 14.4501 4.01473C14.3396 3.69187 14.3051 3.62582 14.2352 3.53328C14.2353 3.5333 14.2353 3.53336 14.2352 3.53328C14.2341 3.53185 14.2204 3.51491 14.19 3.48407C14.1598 3.45354 14.1223 3.4186 14.0809 3.38319C14.0396 3.34777 13.9992 3.31612 13.9644 3.29105C13.9292 3.26572 13.9105 3.25493 13.9089 3.25401C13.9088 3.25396 13.9089 3.254 13.9089 3.25401C13.7728 3.18118 13.7401 3.1726 13.4149 3.11793ZM9.76477 20.4667C9.69493 20.3742 9.66039 20.3081 9.5499 19.9853C10.0033 20 10.5209 20 11.1094 20H12.8904C13.4789 20 13.9967 20 14.4501 19.9853C14.3396 20.3081 14.3051 20.3742 14.2352 20.4667C14.2341 20.4682 14.2204 20.4851 14.19 20.5159C14.1598 20.5465 14.1223 20.5814 14.0809 20.6168C14.0396 20.6522 13.9992 20.6839 13.9644 20.7089C13.9292 20.7343 13.9105 20.7451 13.9089 20.746C13.7728 20.8188 13.7401 20.8274 13.4149 20.8821C13.0151 20.9493 12.5356 21 12 21C11.4644 21 10.9849 20.9493 10.5851 20.8821C10.2599 20.8274 10.2273 20.8189 10.0912 20.746C10.0896 20.7451 10.0708 20.7343 10.0356 20.7089C10.0008 20.6839 9.96045 20.6522 9.91906 20.6168C9.87767 20.5814 9.84017 20.5465 9.81002 20.5159C9.77956 20.4851 9.76592 20.4682 9.76477 20.4667ZM8.18586 6.24769C8.36611 6.15406 8.61857 6.08141 9.0979 6.0416C9.5892 6.0008 10.224 6 11.152 6H12.848C13.776 6 14.4108 6.0008 14.9021 6.0416C15.3814 6.08141 15.6339 6.15406 15.8141 6.24769C16.216 6.45642 16.5436 6.78404 16.7523 7.18586C16.8459 7.36611 16.9186 7.61857 16.9584 8.0979C16.9992 8.5892 17 9.22403 17 10.152V13.848C17 14.776 16.9992 15.4108 16.9584 15.9021C16.9186 16.3814 16.8459 16.6339 16.7523 16.8141C16.5436 17.216 16.216 17.5436 15.8141 17.7523C15.6339 17.8459 15.3814 17.9186 14.9021 17.9584C14.4108 17.9992 13.776 18 12.848 18H11.152C10.224 18 9.5892 17.9992 9.0979 17.9584C8.61857 17.9186 8.36611 17.8459 8.18586 17.7523C7.78404 17.5436 7.45642 17.216 7.24769 16.8141C7.15406 16.6339 7.08141 16.3814 7.04161 15.9021C7.0008 15.4108 7 14.776 7 13.848V10.152C7 9.22403 7.0008 8.5892 7.04161 8.0979C7.08141 7.61857 7.15406 7.36611 7.24769 7.18586C7.45642 6.78404 7.78404 6.45642 8.18586 6.24769Z" fill="white"/>
          </svg>
          <span class="text-white text-sm opacity-50 font-medium">Smart Watches</span>
        </div>
      </div>

      <!-- Separator -->
      <div class="h-6 w-px bg-white opacity-20"></div>

      <!-- Cameras -->
      <div class="flex items-center justify-center flex-1 h-full px-1 cursor-pointer hover:bg-[#404040] transition-colors" @click="navigateToCategory('cameras')">
        <div class="flex flex-col items-center gap-0.5">
          <svg width="20" height="16" viewBox="0 0 20 16" fill="none" class="opacity-50 pt-1 pb-0.5">
            <path d="M4 3H5C5.53 3 6.039 2.7893 6.414 2.4142C6.789 2.0391 7 1.5304 7 1C7 0.7348 7.105 0.4804 7.293 0.2929C7.48 0.1054 7.735 0 8 0H14C14.265 0 14.52 0.1054 14.707 0.2929C14.895 0.4804 15 0.7348 15 1C15 1.5304 15.211 2.0391 15.586 2.4142C15.961 2.7893 16.47 3 17 3H18C18.53 3 19.039 3.2107 19.414 3.5858C19.789 3.9609 20 4.4696 20 5V14C20 14.5304 19.789 15.0391 19.414 15.4142C19.039 15.7893 18.53 16 18 16H4C3.47 16 2.961 15.7893 2.586 15.4142C2.211 15.0391 2 14.5304 2 14V5C2 4.4696 2.211 3.9609 2.586 3.5858C2.961 3.2107 3.47 3 4 3Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M11 12C12.657 12 14 10.6569 14 9C14 7.3431 12.657 6 11 6C9.343 6 8 7.3431 8 9C8 10.6569 9.343 12 11 12Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="text-white text-sm opacity-50 font-medium">Cameras</span>
        </div>
      </div>

      <!-- Separator -->
      <div class="h-6 w-px bg-white opacity-20"></div>

      <!-- Headphones -->
      <div class="flex items-center justify-center flex-1 h-full px-1 cursor-pointer hover:bg-[#404040] transition-colors" @click="navigateToCategory('headphones')">
        <div class="flex flex-col items-center gap-0.5">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" class="opacity-50 pt-1 pb-0.5">
            <path d="M3 11V14C3 15.1046 3.895 16 5 16H6C7.105 16 8 15.1046 8 14V11C8 9.8954 7.105 9 6 9H5C3.895 9 3 9.8954 3 11ZM3 11V8C3 5.8783 3.843 3.8434 5.343 2.3431C6.843 0.8429 8.878 0 11 0C13.122 0 15.157 0.8429 16.657 2.3431C18.157 3.8434 19 5.8783 19 8L19 11M19 11C19 9.8954 18.105 9 17 9H16C14.895 9 14 9.8954 14 11V14C14 15.1046 14.895 16 16 16H17C18.105 16 19 15.1046 19 14V11Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="text-white text-sm opacity-50 font-medium">Headphones</span>
        </div>
      </div>

      <!-- Separator -->
      <div class="h-6 w-px bg-white opacity-20"></div>

      <!-- Gaming -->
      <div class="flex items-center justify-center flex-1 h-full px-1 cursor-pointer hover:bg-[#404040] transition-colors" @click="navigateToCategory('gaming')">
        <div class="flex flex-col items-center gap-0.5">
          <svg width="24" height="20" viewBox="0 0 24 20" fill="none" class="opacity-50 pt-1 pb-0.5">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M5 3C4.448 3 4 3.4477 4 4V12C4 12.5523 4.448 13 5 13H19C19.552 13 20 12.5523 20 12V4C20 3.4477 19.552 3 19 3H5ZM2 4C2 2.3431 3.343 1 5 1H19C20.657 1 22 2.3431 22 4V12C22 13.6569 20.657 15 19 15H5C3.343 15 2 13.6569 2 12V4Z" fill="white"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M9 5C9.552 5 10 5.4477 10 6V7H11C11.552 7 12 7.4477 12 8C12 8.5523 11.552 9 11 9H10V10C10 10.5523 9.552 11 9 11C8.448 11 8 10.5523 8 10V9H7C6.448 9 6 8.5523 6 8C6 7.4477 6.448 7 7 7H8V6C8 5.4477 8.448 5 9 5Z" fill="white"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M16 5.5C16.828 5.5 17.5 6.1716 17.5 7V7.0104C17.5 7.8388 16.828 8.5104 16 8.5104C15.172 8.5104 14.5 7.8388 14.5 7.0104V7C14.5 6.1716 15.172 5.5 16 5.5Z" fill="white"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M19 7.5C19.828 7.5 20.5 8.1715 20.5 9V9.0103C20.5 9.8387 19.828 10.5103 19 10.5103C18.172 10.5103 17.5 9.8387 17.5 9.0103V9C17.5 8.1715 18.172 7.5 19 7.5Z" fill="white"/>
          </svg>
          <span class="text-white text-sm opacity-50 font-medium">Gaming</span>
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
