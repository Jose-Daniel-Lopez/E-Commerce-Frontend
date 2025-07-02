<template>
  <div class="flex items-center justify-start gap-2 bg-[#f5f5f5] p-4 shadow-md lg:rounded-lg lg:shadow-none">
    <img
      src="/images/Search.png"
      alt="Search icon"
      class="h-6 w-6"
    />
    <input
      v-model="searchQuery"
      class="w-full bg-[#f5f5f5] p-1 font-srProDisplay text-sm font-medium text-black outline-none"
      type="search"
      id="search"
      placeholder="Buscar productos..."
    />
  </div>
</template>

<script>
export default {
  name: 'HeaderSearch',
  data() {
    return {
      searchQuery: ''
    }
  }
}
</script>
