<template>
  <section
    :id="sectionId"
    :class="['transition-colors duration-200', sectionContainerClasses]"
  >
    <div class="flex items-center justify-between mb-6">
      <h2 :class="['text-xl font-semibold font-srProDisplay', textClasses]">
        <span :class="sectionHeaderClasses">{{ $t('account.addresses.title') }}</span>
      </h2>
  <div class="flex gap-2">
        <Button
          @click="$emit('refresh-addresses')"
          :class="['px-4', buttonOutlineClasses]"
          text-color="currentColor"
          bg-color="transparent"
          border-width="1px"
          width="auto"
          height="36px"
        >
          <v-icon name="hi-refresh" scale="0.9" class="mr-2 theme-text" />
          <span :class="buttonTextClasses">Refresh</span>
        </Button>
        <Button
          :class="['px-4', buttonOutlineClasses]"
          text-color="currentColor"
          bg-color="transparent"
          border-width="1px"
          width="auto"
          height="36px"
        >
          <v-icon name="hi-plus" scale="0.9" class="mr-2 theme-text" />
          <span :class="buttonTextClasses">{{ $t('account.addresses.addButton') }}</span>
        </Button>
      </div>
    </div>

    <!-- Loading state for addresses -->
    <div v-if="addressesLoading" class="flex items-center justify-center py-8">
      <div class="w-8 h-8 border-b-2 rounded-full animate-spin opacity-70" :class="['border-theme-text']"></div>
      <span :class="['ml-3 font-medium theme-text', loadingTextClasses]">Loading addresses...</span>
    </div>

    <!-- Error state for addresses -->
    <div v-else-if="addressesError" class="p-4 rounded-lg theme-error-bg theme-error-text">
      <p class="font-semibold theme-error-text">{{ addressesError }}</p>
  <Button
  @click="$emit('refresh-addresses')"
  class="px-3 mt-2 text-sm font-semibold transition-colors duration-200 bg-transparent border theme-error-text hover:theme-error-bg"
        text-color="currentColor"
        bg-color="transparent"
        border-width="1px"
        width="auto"
        height="32px"
      >
        Retry
      </Button>
    </div>

    <!-- Empty state when no addresses are available -->
    <div v-else-if="addresses.length === 0" class="py-8 text-center">
      <v-icon name="hi-location-marker" scale="2" :class="['mb-3 opacity-80', emptyStateIconClasses]" />
      <p :class="['mb-4 text-base font-srProDisplay', emptyStateTextClasses]">You have no saved addresses</p>
      <Button
        :class="['px-4 font-semibold transition-colors duration-200', buttonPrimaryClasses]"
        text-color="currentColor"
        bg-color="transparent"
        width="auto"
        height="36px"
      >
        <v-icon name="hi-plus" scale="0.9" class="mr-2" />
        Add your first address
      </Button>
    </div>

    <!-- Display grid of user addresses -->
    <div v-else class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div
        v-for="address in addresses"
        :key="address.id"
        :class="['transition-all duration-200 group', listItemClasses]"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-2">
            <v-icon name="hi-location-marker" scale="1.1" :class="iconColorClasses" />
            <!-- Address Name -->
            <h4 :class="['font-semibold font-srProDisplay', textClasses]">
              {{ address.name }}
            </h4>
          </div>
          <div class="flex gap-1 transition-opacity opacity-0 group-hover:opacity-100">
            <button
              :class="['p-1 transition-colors rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-300 hover:bg-gray-100 dark:hover:bg-gray-700', interactiveIconClasses]"
              aria-label="Editar dirección"
              tabindex="0"
            >
              <v-icon name="hi-pencil" scale="0.9" />
            </button>
            <button
              :class="['p-1 transition-colors rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400', interactiveIconClasses]"
              aria-label="Eliminar dirección"
              tabindex="0"
            >
              <v-icon name="hi-trash" scale="0.9" />
            </button>
          </div>
        </div>

        <!-- Display all address fields from the API -->
        <p :class="['text-sm leading-relaxed font-srProDisplay', textSecondaryClasses]">
          {{ address.street }}<br />
          {{ address.city }}, {{ address.state }} {{ address.zipCode }}<br />
          {{ address.country }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Button from '@/components/shared/Button.vue'

interface Address {
  id: number
  name: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface Props {
  sectionId: string
  addresses: Address[]
  addressesLoading: boolean
  addressesError: string
  sectionContainerClasses: string
  textClasses: string
  sectionHeaderClasses: string
  buttonOutlineClasses: string
  buttonTextClasses: string
  buttonPrimaryClasses: string
  loadingTextClasses: string
  emptyStateIconClasses: string
  emptyStateTextClasses: string
  listItemClasses: string
  iconColorClasses: string
  interactiveIconClasses: string
  textSecondaryClasses: string
}

interface Emits {
  (e: 'refresh-addresses'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>
