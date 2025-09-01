<template>
  <button v-show="visible" @click.prevent.stop="goTop" @keyup.enter.stop="goTop" tabindex="0" aria-label="Scroll to top"
    title="Scroll to top"
    class="fixed z-50 flex items-center justify-center w-12 h-12 text-white rounded-full shadow-lg pointer-events-auto right-6 bottom-20 md:bottom-6 bg-black/80 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
    <v-icon name="hi-chevron-up" />
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useScrollToTop } from '@/composables/useScrollToTop'

const visible = ref(false)
const threshold = 300 // px scrolled before showing the button

const { scrollToTop, forceScrollToTop } = useScrollToTop()

const getScrollY = () => {
  // Some layouts scroll on body while html is overflow:hidden.
  // Use multiple fallbacks to get the actual scroll position.
  const bodyScroll = (document.body as unknown as HTMLElement | null)?.scrollTop
  return window.pageYOffset || document.documentElement.scrollTop || bodyScroll || 0
}

const onScroll = () => {
  visible.value = getScrollY() > threshold
}

onMounted(() => {
  // Attach to multiple possible scroll targets to be resilient across layouts
  const targets: EventTarget[] = [
    window as unknown as EventTarget,
    document as unknown as EventTarget,
    document.documentElement as unknown as EventTarget,
    document.body as unknown as EventTarget,
  ]

  targets.forEach((t) => t && t.addEventListener('scroll', onScroll, { passive: true }))
  onScroll()
})

onUnmounted(() => {
  const targets: EventTarget[] = [
    window as unknown as EventTarget,
    document as unknown as EventTarget,
    document.documentElement as unknown as EventTarget,
    document.body as unknown as EventTarget,
  ]

  targets.forEach((t) => t && t.removeEventListener('scroll', onScroll))
})

const goTop = async () => {
  console.debug('[ScrollToTop] clicked', {
    pageYOffset: window.pageYOffset,
    docScrollTop: document.documentElement.scrollTop,
    bodyScrollTop: document.body.scrollTop,
    visible: visible.value,
  })

  try {
    await scrollToTop(true)
    console.debug('[ScrollToTop] smooth scroll completed')
  } catch (err) {
    console.warn('[ScrollToTop] scrollToTop timed out or failed, forcing top', err)
    forceScrollToTop()
  }
}
</script>
