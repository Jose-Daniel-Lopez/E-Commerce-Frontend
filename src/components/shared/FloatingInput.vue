<template>
  <div class="relative transition-all duration-300 hover:-translate-y-0.5" :class="animationClass">
    <div class="relative">
      <input
        :id="id"
        :value="modelValue"
        :type="inputType"
        :autocomplete="autocomplete"
        :required="required"
        @input="handleInput"
        :class="inputClasses"
        placeholder=" "
      />
      <label :for="id" :class="labelClasses">
        {{ label }}
      </label>
      <slot name="suffix" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  id: string
  label: string
  modelValue: string
  type?: string
  autocomplete?: string
  required?: boolean
  animationClass?: string
  hasError?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  autocomplete: 'off',
  required: false,
  animationClass: '',
  hasError: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const inputType = computed(() => props.type)

const inputClasses = computed(() => [
  'peer w-full px-4 py-4 border rounded-xl bg-input-background backdrop-blur-sm font-srProDisplay text-primary focus:outline-none focus:border-primary focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,0,0,0.05)] focus:scale-[1.01] transition-all duration-300',
  props.hasError ? 'border-red-500' : 'border-input-border',
  props.type === 'password' ? 'pr-12' : '',
])

const labelClasses = computed(() => [
  'absolute left-4 top-4 font-srProDisplay text-muted-foreground transition-all duration-300 pointer-events-none origin-left peer-focus:-translate-y-1/2 peer-focus:translate-x-[-2px] peer-focus:scale-75 peer-focus:top-0 peer-focus:left-[14px] peer-focus:text-primary peer-focus:bg-white peer-focus:px-1.5 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:translate-x-[-2px] peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:left-[14px] peer-[:not(:placeholder-shown)]:text-primary peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1.5 z-[1]',
  props.hasError ? 'peer-focus:text-red-500 peer-[:not(:placeholder-shown)]:text-red-500' : '',
])
</script>
