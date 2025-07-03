<template>
  <div class="flex items-center justify-start gap-2 bg-[#f5f5f5] p-4 shadow-md lg:rounded-lg lg:shadow-none">
    <v-icon name="fa-search" scale="1.2" class="text-gray-400" />
    <input
      v-model="searchQuery"
      class="w-full bg-[#f5f5f5] p-0.5 font-srProDisplay text-sm font-medium text-black outline-none"
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
