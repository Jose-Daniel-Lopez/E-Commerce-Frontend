<template>
  <div class="pt-[85px] lg:pt-0 bg-white text-black min-h-screen flex items-center justify-center">
    <div class="max-w-md w-full mx-auto p-6">
      <div class="bg-white border border-[#EBEBEB] rounded-lg p-8 text-center">
        <!-- Loading State -->
        <div v-if="loading" class="space-y-4">
          <div
            class="animate-spin h-12 w-12 border-4 border-black border-t-transparent rounded-full mx-auto"
          ></div>
          <h2 class="font-srProDisplay text-xl font-semibold text-black">
            {{ $t('auth.verify.loading') }}
          </h2>
          <p class="font-srProDisplay text-[#666666] text-sm">
            {{ $t('auth.verify.loadingMessage') }}
          </p>
        </div>

        <!-- Success State -->
        <div v-else-if="verified" class="space-y-4">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <v-icon name="hi-check" scale="2" class="text-green-600" />
          </div>
          <h2 class="font-srProDisplay text-xl font-semibold text-black">{{ $t('auth.verify.success') }}</h2>
          <p class="font-srProDisplay text-[#666666] text-sm">
            {{ $t('auth.verify.successMessage') }}
          </p>
          <button
            @click="goToLogin"
            class="w-full bg-black text-white font-srProDisplay font-medium py-3 rounded-md hover:bg-[#333333] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg"
          >
            {{ $t('auth.verify.goToLogin') }}
          </button>
        </div>

        <!-- Error State -->
        <div v-else class="space-y-4">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <v-icon name="hi-x" scale="2" class="text-red-600" />
          </div>
          <h2 class="font-srProDisplay text-xl font-semibold text-black">{{ $t('auth.verify.error') }}</h2>
          <p class="font-srProDisplay text-[#666666] text-sm">{{ errorMessage }}</p>
          <div class="space-y-2">
            <button
              @click="goToLogin"
              class="w-full bg-black text-white font-srProDisplay font-medium py-3 rounded-md hover:bg-[#333333] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg"
            >
              {{ $t('auth.verify.goToLogin') }}
            </button>
            <button
              @click="goToRegister"
              class="w-full border border-[#EBEBEB] text-black font-srProDisplay font-medium py-3 rounded-md hover:bg-gray-50 transition-all duration-300"
            >
              {{ $t('auth.verify.registerAgain') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/lib/axios'

const router = useRouter()
const route = useRoute()

const loading = ref(true)
const verified = ref(false)
const errorMessage = ref('')

const verifyAccount = async (token: string) => {
  try {
    await api.get(`/auth/verify?token=${token}`)
    verified.value = true
  } catch (error: unknown) {
    console.error('Verification error:', error)
    const errorObj = error as { response?: { data?: { error?: string } } }
    errorMessage.value = errorObj.response?.data?.error || 'An unknown error occurred.'
  } finally {
    loading.value = false
  }
}

const goToLogin = () => {
  router.push({ name: 'login' })
}

const goToRegister = () => {
  router.push({ name: 'register' })
}

onMounted(() => {
  const token = route.query.token as string

  if (!token) {
    errorMessage.value = 'No verification token provided.'
    loading.value = false
    return
  }

  verifyAccount(token)
})
</script>

<style scoped>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
