<template>
  <FloatingInput
    :id="id"
    :label="label"
    :model-value="modelValue"
    :type="showPassword ? 'text' : 'password'"
    :autocomplete="autocomplete"
    :required="required"
    :animation-class="animationClass"
    :has-error="hasError"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #suffix>
      <button
        type="button"
        @click="togglePasswordVisibility"
        class="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground hover:text-primary transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 rounded-md cursor-pointer"
        :aria-label="showPassword ? 'Hide password' : 'Show password'"
        :aria-pressed="showPassword"
      >
        <v-icon :name="showPassword ? 'hi-eye-off' : 'hi-eye'" scale="1.4" aria-hidden="true" />
      </button>
    </template>
  </FloatingInput>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FloatingInput from './FloatingInput.vue'

interface Props {
  id: string
  label: string
  modelValue: string
  autocomplete?: string
  required?: boolean
  animationClass?: string
  hasError?: boolean
}

withDefaults(defineProps<Props>(), {
  autocomplete: 'current-password',
  required: false,
  animationClass: '',
  hasError: false
})

defineEmits<{
  'update:modelValue': [value: string]
}>()

const showPassword = ref(false)

/**
 * Toggles the visibility of the password input
 */
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}
</script>
