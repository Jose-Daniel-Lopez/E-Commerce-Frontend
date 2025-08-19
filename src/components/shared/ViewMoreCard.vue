<template>
  <div
    class="mb-4 ml-[2px] h-auto w-[163.5px] rounded-[9px] px-3 py-6 duration-500 hover:scale-[1.02] xs:w-[190px] sm:mb-0 sm:w-[298px] md:h-[435px] md:w-[240px] md:px-4 xl:w-[268px]"
  >
    <div class="flex h-[355px] w-full flex-col items-center justify-center gap-4 sm:h-[330px] md:h-[390px]">
      <a
        href="#"
        @click.prevent
        class="font-sm flex h-12 w-full items-center justify-center rounded-md border theme-border px-5 font-srProDisplay font-medium hover:button-primary sm:w-[183px] transition-colors duration-200"
      >
        Ver Más...
      </a>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ViewMoreCard',
}
</script>
