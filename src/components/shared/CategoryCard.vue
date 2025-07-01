<template>
  <router-link :to="`/category/${category.slug}`">
    <div class="mb-3 !flex !h-[128px] !w-[160px] flex-col items-center justify-center gap-3 rounded-[15px] bg-[#ededed] py-4 text-white hover:bg-gray-300 transition-colors duration-200">
      <img
        :src="category.image.url"
        :alt="category.image.altText"
        class="h-12 w-12 object-contain"
      />
      <p class="font-srProDisplay font-medium text-black">
        {{ category.name }}
      </p>
    </div>
  </router-link>
</template>

<script>
export default {
  name: 'CategoryCard',
  props: {
    category: {
      type: Object,
      required: true
    }
  }
}
</script>
