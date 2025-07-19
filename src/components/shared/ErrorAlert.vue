<template>
  <Transition
    enter-active-class="animate-slideDown"
    leave-active-class="animate-slideUp"
    enter-from-class="opacity-0 -translate-y-2"
    leave-to-class="opacity-0 -translate-y-2"
  >
    <div
      v-if="show && message"
      class="mb-6 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-3"
      role="alert"
      aria-live="polite"
    >
      <p class="font-srProDisplay text-sm text-red-700">{{ message }}</p>
      <button
        @click="$emit('dismiss')"
        class="text-red-600 hover:text-red-800 text-sm transition-all duration-200 hover:scale-110 cursor-pointer"
        aria-label="Dismiss error message"
      >
        <v-icon name="hi-x" scale="1.2" />
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
interface Props {
  message: string
  show: boolean
}

defineProps<Props>()

defineEmits<{
  dismiss: []
}>()
</script>
