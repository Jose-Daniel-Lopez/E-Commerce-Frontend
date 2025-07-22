<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closeModal">
    <div class="bg-white rounded-xl p-6 max-w-md w-full mx-4" @click.stop>
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-srProDisplay font-semibold text-black">
          Choose Your Avatar
        </h3>
        <button @click="closeModal" class="text-gray-500 hover:text-black transition-colors">
          <v-icon name="hi-x" scale="1.2" />
        </button>
      </div>

      <!-- Current Avatar -->
      <div class="text-center mb-6">
        <h4 class="text-sm font-srProDisplay font-medium text-gray-700 mb-3">Current Avatar</h4>
        <div class="flex justify-center">
          <div class="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
            <img :src="currentAvatar" :alt="userName" class="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <!-- Avatar Options -->
      <div class="mb-6">
        <h4 class="text-sm font-srProDisplay font-medium text-gray-700 mb-3">Select New Avatar</h4>
        <div class="grid grid-cols-4 gap-3">
          <div
            v-for="(avatar, index) in avatarOptions"
            :key="index"
            class="relative cursor-pointer group"
            @click="selectAvatar(avatar)"
          >
            <div 
              class="w-16 h-16 rounded-full overflow-hidden border-2 transition-all duration-200"
              :class="selectedAvatar === avatar ? 'border-black scale-105' : 'border-gray-200 group-hover:border-gray-400'"
            >
              <img :src="avatar" :alt="`Avatar option ${index + 1}`" class="w-full h-full object-cover" />
            </div>
            <!-- Selected indicator -->
            <div 
              v-if="selectedAvatar === avatar"
              class="absolute -top-1 -right-1 w-5 h-5 bg-black rounded-full flex items-center justify-center"
            >
              <v-icon name="hi-check" scale="0.7" class="text-white" />
            </div>
          </div>
        </div>
      </div>

      <!-- Generate New Options Button -->
      <button
        @click="generateNewAvatars"
        :disabled="isGenerating"
        class="w-full mb-6 px-4 py-3 border border-gray-300 rounded-lg font-srProDisplay text-gray-700 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <v-icon 
          name="hi-refresh" 
          scale="0.9" 
          class="mr-2 transition-transform duration-200"
          :class="{ 'animate-spin': isGenerating }"
        />
        {{ isGenerating ? 'Generating...' : 'Generate New Options' }}
      </button>

      <!-- Action Buttons -->
      <div class="flex gap-3">
        <button
          @click="closeModal"
          class="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-srProDisplay text-gray-700 hover:bg-gray-50 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          @click="saveAvatar"
          :disabled="!selectedAvatar || isSaving"
          class="flex-1 px-4 py-3 bg-black text-white rounded-lg font-srProDisplay hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isSaving ? 'Saving...' : 'Save Avatar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Props {
  currentAvatar: string
  userName: string
  userId: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  save: [avatarUrl: string]
}>()

const selectedAvatar = ref<string>('')
const avatarOptions = ref<string[]>([])
const isGenerating = ref(false)
const isSaving = ref(false)

// Generate random avatar URLs using RoboHash API
const generateAvatarUrl = (seed: string, set: string = 'set1') => {
  // RoboHash API: https://robohash.org/{seed}?set={set}&size=200x200
  return `https://robohash.org/${encodeURIComponent(seed)}?set=${set}&size=200x200&bgset=bg1`
}

const generateNewAvatars = async () => {
  isGenerating.value = true
  avatarOptions.value = []
  
  try {
    // Generate 8 different avatar options using different seeds
    const sets = ['set1', 'set2', 'set3', 'set4'] // Different robot styles
    const seeds = []
    
    // Create unique seeds for variety
    for (let i = 0; i < 8; i++) {
      const timestamp = Date.now()
      const random = Math.random().toString(36).substring(7)
      const seed = `${props.userName}-${props.userId}-${timestamp}-${random}-${i}`
      const set = sets[i % sets.length]
      seeds.push(generateAvatarUrl(seed, set))
    }
    
    avatarOptions.value = seeds
    
    // Auto-select the first option
    if (seeds.length > 0) {
      selectedAvatar.value = seeds[0]
    }
  } catch (error) {
    console.error('Error generating avatars:', error)
  } finally {
    isGenerating.value = false
  }
}

const selectAvatar = (avatar: string) => {
  selectedAvatar.value = avatar
}

const closeModal = () => {
  emit('close')
}

const saveAvatar = async () => {
  if (!selectedAvatar.value) return
  
  isSaving.value = true
  
  try {
    // Emit the selected avatar URL to parent
    emit('save', selectedAvatar.value)
  } catch (error) {
    console.error('Error saving avatar:', error)
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  generateNewAvatars()
})
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
