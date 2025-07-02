<template>
  <div class="pt-[85px] lg:pt-0 bg-white text-black">
    <Wrapper class="py-8">
      <!-- Breadcrumb -->
      <BreadcrumbNav :breadcrumbs="breadcrumbs" />

      <!-- Header -->
      <section class="max-w-7xl mx-auto mb-8">
        <h1 class="font-srProDisplay text-2xl font-semibold text-left text-black">Contáctanos</h1>
      </section>

      <!-- Contact Content (Shopping Cart Style Layout) -->
      <section class="max-w-7xl mx-auto mb-16">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          <!-- Left Panel - Contact Information -->
          <div class="bg-white rounded-lg p-6 h-full">
            <h2 class="font-srProDisplay text-xl font-semibold text-black mb-6">Información de Contacto</h2>

            <div class="space-y-0">
              <!-- Email Block -->
              <div class="flex items-start gap-4 py-8 border-b border-[#EBEBEB]">
                <div class="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <v-icon name="hi-mail" class="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 class="font-srProDisplay text-lg font-medium text-black mb-1">Correo Electrónico</h3>
                  <p class="font-srProDisplay text-[#666666] text-sm mb-1">info@cyberstore.com</p>
                  <p class="font-srProDisplay text-[#666666] text-sm">soporte@cyberstore.com</p>
                </div>
              </div>

              <!-- Phone Block -->
              <div class="flex items-start gap-4 py-12 border-b border-[#EBEBEB]">
                <div class="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <v-icon name="hi-phone" class="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 class="font-srProDisplay text-lg font-medium text-black mb-1">Teléfono</h3>
                  <p class="font-srProDisplay text-[#666666] text-sm mb-1">+34 91 123 45 67</p>
                  <p class="font-srProDisplay text-[#999999] text-xs">Lun - Vie: 9:00 - 18:00</p>
                </div>
              </div>

              <!-- Location Block -->
              <div class="flex items-start gap-4 py-12 border-b border-[#EBEBEB]">
                <div class="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <v-icon name="hi-location-marker" class="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 class="font-srProDisplay text-lg font-medium text-black mb-1">Ubicación</h3>
                  <p class="font-srProDisplay text-[#666666] text-sm mb-1">Calle Gran Vía, 123</p>
                  <p class="font-srProDisplay text-[#666666] text-sm">28013 Madrid, España</p>
                </div>
              </div>

              <!-- Response Time Block -->
              <div class="flex items-start gap-4 py-12">
                <div class="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <v-icon name="hi-clock" class="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 class="font-srProDisplay text-lg font-medium text-black mb-1">Tiempo de Respuesta</h3>
                  <p class="font-srProDisplay text-[#666666] text-sm mb-1">Normalmente respondemos en 24 horas</p>
                  <p class="font-srProDisplay text-[#999999] text-xs">En horario laboral: en 4 horas</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Panel - Contact Form (Order Summary Style Card) -->
          <div>
            <div class="bg-white border border-[#EBEBEB] rounded-lg p-6 h-full">
              <h2 class="font-srProDisplay text-xl font-semibold text-black mb-6">Enviar Mensaje</h2>

              <form class="space-y-4">
                <!-- Name -->
                <div>
                  <label class="block font-srProDisplay text-sm font-medium text-black mb-2">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    required
                    class="w-full px-4 py-3 border border-[#EBEBEB] rounded-md bg-white font-srProDisplay text-black placeholder-[#999999] focus:outline-none focus:border-black transition-colors duration-200"
                    placeholder="Introduce tu nombre completo"
                  />
                </div>

                <!-- Email -->
                <div>
                  <label class="block font-srProDisplay text-sm font-medium text-black mb-2">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    required
                    class="w-full px-4 py-3 border border-[#EBEBEB] rounded-md bg-white font-srProDisplay text-black placeholder-[#999999] focus:outline-none focus:border-black transition-colors duration-200"
                    placeholder="tu@email.com"
                  />
                </div>

                <!-- Subject -->
                <div>
                  <label class="block font-srProDisplay text-sm font-medium text-black mb-2">
                    Asunto
                  </label>
                  <input
                    type="text"
                    required
                    class="w-full px-4 py-3 border border-[#EBEBEB] rounded-md bg-white font-srProDisplay text-black placeholder-[#999999] focus:outline-none focus:border-black transition-colors duration-200"
                    placeholder="¿En qué podemos ayudarte?"
                  />
                </div>

                <!-- Message -->
                <div>
                  <label class="block font-srProDisplay text-sm font-medium text-black mb-2">
                    Mensaje
                  </label>
                  <textarea
                    required
                    rows="4"
                    class="w-full px-4 py-3 border border-[#EBEBEB] rounded-md bg-white font-srProDisplay text-black placeholder-[#999999] focus:outline-none focus:border-black transition-colors duration-200 resize-none"
                    placeholder="Describe tu consulta o mensaje..."
                  ></textarea>
                </div>

                <!-- Divider -->
                <div class="border-t border-[#EBEBEB] pt-4">
                  <!-- Contact Preference -->
                  <div class="mb-4">
                    <label class="block font-srProDisplay text-sm font-medium text-[#666666] mb-3">
                      Método de contacto preferido
                    </label>
                    <div class="space-y-2">
                      <label class="flex items-center">
                        <input type="radio" name="contactMethod" value="email" class="mr-3 text-black" checked />
                        <span class="font-srProDisplay text-sm text-black">Correo Electrónico</span>
                      </label>
                      <label class="flex items-center">
                        <input type="radio" name="contactMethod" value="phone" class="mr-3 text-black" />
                        <span class="font-srProDisplay text-sm text-black">Teléfono</span>
                      </label>
                    </div>
                  </div>
                </div>

                <!-- Submit Button -->
                <button
                  type="submit"
                  @click.prevent="submitForm"
                  class="w-full bg-black text-white font-srProDisplay font-medium py-4 rounded-md hover:bg-[#333333] transition-colors duration-200"
                >
                  Enviar Mensaje
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="max-w-7xl mx-auto mb-16">
        <div class="bg-white border border-[#EBEBEB] rounded-lg overflow-hidden">
          <div class="px-6 py-4 border-b border-[#EBEBEB] bg-gray-50">
            <h2 class="font-srProDisplay text-lg font-semibold text-black">Preguntas Frecuentes</h2>
          </div>

          <div class="divide-y divide-[#EBEBEB]">
            <div>
              <button
                class="w-full px-6 py-4 text-left font-srProDisplay font-medium text-black hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between bg-gray-50"
                @click="toggleFaq(0)"
              >
                ¿Cuál es el tiempo de entrega?
                <v-icon name="hi-chevron-down" class="w-5 h-5 text-[#666666] transition-transform duration-200" :class="{ 'rotate-180': activeFaq === 0 }" />
              </button>
              <div v-show="activeFaq === 0" class="px-6 pb-4 py-4 bg-white">
                <p class="font-srProDisplay text-[#666666] text-sm leading-relaxed">
                  La entrega estándar tarda de 2-3 días laborables para península y de 3-5 días para Baleares y Canarias.
                </p>
              </div>
            </div>

            <div>
              <button
                class="w-full px-6 py-4 text-left font-srProDisplay font-medium text-black hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between bg-gray-50"
                @click="toggleFaq(1)"
              >
                ¿Qué métodos de pago aceptáis?
                <v-icon name="hi-chevron-down" class="w-5 h-5 text-[#666666] transition-transform duration-200" :class="{ 'rotate-180': activeFaq === 1 }" />
              </button>
              <div v-show="activeFaq === 1" class="px-6 pb-4 py-4 bg-white">
                <p class="font-srProDisplay text-[#666666] text-sm leading-relaxed">
                  Aceptamos todas las tarjetas de crédito/débito principales (Visa, Mastercard, American Express), PayPal, Apple Pay y Google Pay.
                </p>
              </div>
            </div>

            <div>
              <button
                class="w-full px-6 py-4 text-left font-srProDisplay font-medium text-black hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between bg-gray-50"
                @click="toggleFaq(2)"
              >
                ¿Puedo devolver un producto?
                <v-icon name="hi-chevron-down" class="w-5 h-5 text-[#666666] transition-transform duration-200" :class="{ 'rotate-180': activeFaq === 2 }" />
              </button>
              <div v-show="activeFaq === 2" class="px-6 pb-4 py-4 bg-white">
                <p class="font-srProDisplay text-[#666666] text-sm leading-relaxed">
                  Sí, tienes 30 días para devolver cualquier producto en perfectas condiciones. Los gastos de envío de devolución corren por tu cuenta.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Wrapper>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Wrapper from '@/components/shared/Wrapper.vue'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav.vue'

// Breadcrumb config
const breadcrumbs = [
  { label: 'Contáctanos' }
]

// FAQ state
const activeFaq = ref<number | null>(null)

// Methods
const submitForm = () => {
  // Form submission logic
  console.log('Form submitted')
}

const toggleFaq = (index: number) => {
  activeFaq.value = activeFaq.value === index ? null : index
}
</script>
