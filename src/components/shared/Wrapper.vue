<template>
  <div
    :class="`mx-auto max-w-full px-3 lg:max-w-[1024px] lg:px-0 xl:max-w-[1120px] ${className}`"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Wrapper',
  props: {
    className: {
      type: String,
      default: ''
    }
  }
}
</script>
