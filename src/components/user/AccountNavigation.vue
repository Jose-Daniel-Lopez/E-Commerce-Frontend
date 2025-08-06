<template>
  <!-- Desktop Navigation -->
  <nav
    :class="['hidden p-6 rounded-lg shadow-lg lg:block', navClasses]"
    aria-label="Desktop account navigation"
  >
    <h2 :class="['mb-4 text-lg font-extrabold tracking-tight uppercase font-srProDisplay', textClasses]">
      {{ $t('account.navigation') }}
    </h2>
    <ul class="space-y-1" role="list">
      <li v-for="section in sections" :key="section.id" role="listitem">
        <a
          :href="`#${section.id}`"
          class="flex items-center px-3 py-3 text-sm text-gray-700 transition-all duration-200 border-l-4 border-transparent rounded-lg cursor-pointer dark:text-gray-300 group font-srProDisplay hover:bg-gradient-to-r hover:from-gray-50 dark:hover:from-gray-700 hover:to-gray-100 dark:hover:to-gray-600 hover:border-black dark:hover:border-white focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-500"
          :aria-label="`Go to ${section.label} section`"
          :aria-current="activeSection === section.id ? 'page' : undefined"
        >
          <v-icon
            :name="section.icon"
            scale="1.1"
            class="mr-3 text-gray-500 transition-colors duration-200 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white"
            :aria-hidden="true"
          />
          <span
            class="transition-all duration-200 group-hover:text-black dark:group-hover:text-white group-hover:font-semibold"
          >{{ section.label }}</span>
        </a>
      </li>
    </ul>
  </nav>

  <!-- Mobile Navigation Toggle -->
  <button
    @click="$emit('toggleMobile')"
    :class="['fixed z-50 p-3 transition-all duration-200 rounded-lg shadow-lg lg:hidden top-28 left-4 hover:shadow-xl', navClasses, 'focus:outline-none focus:ring-2 focus:ring-blue-500']"
    aria-label="Open mobile navigation menu"
    :aria-expanded="isMobileNavOpen"
    aria-controls="mobile-nav"
  >
    <v-icon name="hi-menu" scale="1.2" class="text-black" aria-hidden="true" />
  </button>

  <!-- Mobile Navigation Overlay -->
  <div
    v-if="isMobileNavOpen"
    class="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
    @click="$emit('closeMobile')"
    aria-hidden="true"
  ></div>

  <!-- Mobile Navigation Sidebar -->
  <nav
    id="mobile-nav"
    :class="[
      'lg:hidden fixed top-0 left-0 h-full w-80 shadow-xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto',
      navClasses,
      isMobileNavOpen ? 'translate-x-0' : '-translate-x-full',
    ]"
    aria-label="Mobile account navigation"
    :aria-hidden="!isMobileNavOpen"
  >
    <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 :class="['text-lg font-semibold font-srProDisplay', textClasses]">
          {{ $t('account.navigation') }}
        </h2>
        <button
          @click="$emit('closeMobile')"
          :class="['transition-colors cursor-pointer', linkClasses, 'focus:outline-none focus:ring-2 focus:ring-blue-500 rounded']"
          aria-label="Close mobile navigation menu"
        >
          <v-icon name="hi-x" scale="1.2" aria-hidden="true" />
        </button>
      </div>
      <ul class="space-y-1" role="list">
        <li v-for="section in sections" :key="`mobile-${section.id}`" role="listitem">
          <a
            :href="`#${section.id}`"
            @click="$emit('closeMobile')"
            class="flex items-center px-3 py-3 text-sm text-gray-700 transition-all duration-200 border-l-4 border-transparent rounded-lg cursor-pointer dark:text-gray-300 group font-srProDisplay hover:bg-gradient-to-r hover:from-gray-50 dark:hover:from-gray-700 hover:to-gray-100 dark:hover:to-gray-600 hover:border-black dark:hover:border-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            :aria-label="`Go to ${section.label} section`"
            :aria-current="activeSection === section.id ? 'page' : undefined"
          >
            <v-icon
              :name="section.icon"
              scale="1.1"
              class="mr-3 text-gray-500 transition-colors duration-200 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white"
              :aria-hidden="true"
            />
            <span
              class="transition-all duration-200 group-hover:text-black dark:group-hover:text-white group-hover:font-medium"
            >{{ section.label }}</span>
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
interface Section {
  id: string
  label: string
  icon: string
}

interface Props {
  sections: Section[]
  activeSection: string
  isMobileNavOpen: boolean
  navClasses: string
  textClasses: string
  linkClasses: string
}

defineProps<Props>()

defineEmits<{
  toggleMobile: []
  closeMobile: []
}>()
</script>
