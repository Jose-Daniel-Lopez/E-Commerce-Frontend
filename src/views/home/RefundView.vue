<template>
  <div :class="['pt-[85px] lg:pt-0 animate-fadeInUp', pageBackgroundClasses]">
    <Wrapper class="py-8">
      <BreadcrumbNav :breadcrumbs="breadcrumbs" />

      <div class="max-w-5xl mx-auto space-y-6">
        <div class="flex items-center justify-center gap-3 mb-4">
          <v-icon name="hi-refresh" class="!w-6 !h-6 mb-12" />
          <h1 :class="sectionTitleClasses">Refund & Return Policy</h1>
        </div>

        <div :class="sectionContainerClasses">
          <p :class="heroDescriptionClasses">
            We want you to be completely satisfied with your purchase. If you are not satisfied,
            our refund and return policy explains how to return items and receive a refund.
          </p>

          <h3 class="text-lg font-semibold mb-2" :class="textClasses">1. Returns Eligibility</h3>
          <p :class="textSecondaryClasses">
            Items must be returned within 30 days of delivery in their original condition, unused,
            and with all original packaging, tags, and documentation. Some items (e.g., opened software,
            perishable goods) may not be eligible for return.
          </p>

          <h3 class="text-lg font-semibold mb-2 mt-4" :class="textClasses">2. How to Request a Return</h3>
          <p :class="textSecondaryClasses">
            To request a return, contact our support team with your order number and reason for return.
            We will provide instructions and a return shipping label when applicable.
          </p>

          <h3 class="text-lg font-semibold mb-2 mt-4" :class="textClasses">3. Refund Processing</h3>
          <p :class="textSecondaryClasses">
            Once we receive and inspect the returned item, refunds are processed to the original
            payment method within 5-10 business days. Shipping costs are non-refundable unless the
            return is due to our error.
          </p>

          <h3 class="text-lg font-semibold mb-2 mt-4" :class="textClasses">4. Exchanges</h3>
          <p :class="textSecondaryClasses">
            If you need an exchange, contact support. Exchanges depend on product availability and may
            require a separate shipment.
          </p>

          <div class="mt-4 text-sm text-gray-500 dark:text-gray-400">
            <p>Last updated: August 2025</p>
          </div>
        </div>
      </div>
    </Wrapper>
  </div>
</template>

<script setup lang="ts">
import '@/assets/base.css'
import Wrapper from '@/components/shared/Wrapper.vue'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav.vue'
import { useThemeClasses } from '@/composables/useThemeClasses'

const { pageBackgroundClasses, sectionTitleClasses, sectionContainerClasses, heroDescriptionClasses, textClasses, textSecondaryClasses } = useThemeClasses()

const breadcrumbs = [{ label: 'refund.title' }]
</script>

<style scoped>
button:focus { outline: none; box-shadow: none }
a:focus { outline: none; box-shadow: none }
svg:focus { outline: none; box-shadow: none }
</style>
