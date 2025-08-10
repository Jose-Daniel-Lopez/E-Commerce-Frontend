<script setup lang="ts">
type Link = {
  href: string
  label?: string
  target?: '_blank' | '_self' | '_parent' | '_top'
  rel?: string
}

const props = defineProps<{
  links: Link[]
  linkClass?: string
}>()

// Function to compute the rel attribute based on target
// If target is '_blank', default to 'noopener noreferrer' for security
const computedRel = (l: Link) =>
  l.target === '_blank' ? (l.rel ?? 'noopener noreferrer') : (l.rel ?? undefined)
</script>

<template>
  <div class="mx-auto mt-2 flex w-[173px] items-center justify-between md:mx-0 lg:h-[16px]">
    <!-- Twitter/X -->
    <a
      v-if="props.links[0]"
      :href="props.links[0].href"
      :aria-label="props.links[0].label || 'Twitter'"
      :class="props.linkClass"
      :target="props.links[0].target || undefined"
      :rel="computedRel(props.links[0])"
    >
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
        <path
          d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"
        />
      </svg>
    </a>

    <!-- Facebook -->
    <a
      v-if="props.links[1]"
      :href="props.links[1].href"
      :aria-label="props.links[1].label || 'Facebook'"
      :class="props.linkClass"
      :target="props.links[1].target || undefined"
      :rel="computedRel(props.links[1])"
    >
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
        />
      </svg>
    </a>

    <!-- GitHub -->
    <a
      v-if="props.links[2]"
      :href="props.links[2].href"
      :aria-label="props.links[2].label || 'GitHub'"
      :class="props.linkClass"
      :target="props.links[2].target || undefined"
      :rel="computedRel(props.links[2])"
    >
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
        />
      </svg>
    </a>
  </div>
</template>
