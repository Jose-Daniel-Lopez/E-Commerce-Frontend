<template>
  <div :class="['pt-[85px] lg:pt-0 min-h-screen flex items-center justify-center', pageBackgroundClasses]">
    <div class="max-w-md w-full mx-auto p-6">
  <div :class="['border rounded-lg p-8 text-center', cardClasses]">
        <!-- Loading State -->
        <div v-if="loading" class="space-y-4">
          <div
            class="animate-spin h-12 w-12 border-4 border-foreground border-t-transparent rounded-full mx-auto"
          ></div>
          <h2 :class="['font-srProDisplay text-xl font-semibold', textClasses]">
            {{ $t('auth.verify.loading') }}
          </h2>
          <p :class="['font-srProDisplay text-sm', textMutedClasses]">
            {{ $t('auth.verify.loadingMessage') }}
          </p>
        </div>

        <!-- Success State -->
        <div v-else-if="verified" class="space-y-4">
          <div class="w-16 h-16 bg-success-bg rounded-full flex items-center justify-center mx-auto">
            <v-icon name="hi-check" scale="2" class="text-success" />
          </div>
          <h2 :class="['font-srProDisplay text-xl font-semibold', textClasses]">{{ $t('auth.verify.success') }}</h2>
          <p :class="['font-srProDisplay text-sm', textMutedClasses]">
            {{ $t('auth.verify.successMessage') }}
          </p>
          <button
            @click="goToLogin"
            :class="['w-full font-srProDisplay font-medium py-3 rounded-md hover:opacity-95 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg', buttonPrimaryClasses]"
          >
            {{ $t('auth.verify.goToLogin') }}
          </button>
        </div>

        <!-- Error State -->
        <div v-else class="space-y-4">
          <div class="w-16 h-16 bg-error-bg rounded-full flex items-center justify-center mx-auto">
            <v-icon name="hi-x" scale="2" class="text-error" />
          </div>
          <h2 :class="['font-srProDisplay text-xl font-semibold', textClasses]">{{ $t('auth.verify.error') }}</h2>
          <p :class="['font-srProDisplay text-sm', textMutedClasses]">{{ errorMessage }}</p>
          <div class="space-y-2">
            <button
              @click="goToLogin"
              :class="['w-full font-srProDisplay font-medium py-3 rounded-md hover:opacity-95 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg', buttonPrimaryClasses]"
            >
              {{ $t('auth.verify.goToLogin') }}
            </button>
            <button
              @click="goToRegister"
              :class="['w-full font-srProDisplay font-medium py-3 rounded-md hover:bg-surface-hover transition-all duration-300', buttonOutlineClasses]"
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
import { useThemeClasses } from '@/composables/useThemeClasses'

const router = useRouter()
const route = useRoute()

const loading = ref(true)
const verified = ref(false)
const errorMessage = ref('')

// Theme classes
const {
  pageBackgroundClasses,
  cardClasses,
  textClasses,
  textMutedClasses,
  buttonPrimaryClasses,
  buttonOutlineClasses
} = useThemeClasses()

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
/* Component-specific animations */
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
