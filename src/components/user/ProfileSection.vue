<template>
  <section
    :id="sectionId"
    :class="['transition-colors duration-200', sectionContainerClasses]"
    aria-labelledby="profile-title"
  >
    <div class="flex items-center justify-between mb-6">
      <h2 id="profile-title" :class="['text-xl font-semibold font-srProDisplay', textClasses]">
        <span :class="sectionHeaderClasses">{{ $t('account.profile.title') }}</span>
      </h2>
      <div class="flex gap-2" role="group" aria-label="Profile actions">
        <Button
          @click="$emit('toggleEdit')"
          :class="['px-4 transition-all duration-200', buttonOutlineClasses]"
          text-color="currentColor"
          bg-color="transparent"
          border-width="1px"
          width="auto"
          height="36px"
          :aria-label="isEditProfileOpen ? 'Cancel edit profile' : 'Edit profile'"
        >
          <v-icon
            :name="isEditProfileOpen ? 'hi-x' : 'hi-pencil'"
            scale="0.9"
            class="mr-2 transition-transform duration-200"
            :class="{ 'rotate-90': isEditProfileOpen }"
            aria-hidden="true"
          />
          <span :class="buttonTextClasses">{{
            isEditProfileOpen
              ? $t('account.profile.cancelButton')
              : $t('account.profile.editButton')
          }}</span>
        </Button>
        <Button
          @click="$emit('refreshProfile')"
          :class="['px-4 transition-all duration-200', buttonOutlineClasses]"
          text-color="currentColor"
          bg-color="transparent"
          border-width="1px"
          width="auto"
          height="36px"
          aria-label="Refresh profile data"
        >
          <v-icon name="hi-refresh" scale="0.9" class="mr-2" aria-hidden="true" />
          <span :class="buttonTextClasses">{{ $t('account.profile.refreshButton') }}</span>
        </Button>
      </div>
    </div>

    <!-- Profile Display -->
    <div
      v-show="!isEditProfileOpen"
      class="transition-all duration-300 ease-in-out"
      :class="{
        'opacity-0 transform -translate-y-2': isEditProfileOpen,
        'opacity-100 transform translate-y-0': !isEditProfileOpen,
      }"
      role="region"
      aria-live="polite"
    >
      <div class="flex flex-col items-start gap-6 md:flex-row">
        <div class="relative">
          <img
            :src="user?.avatar || '/images/User.png'"
            :alt="`${user?.username || 'User'} profile picture`"
            class="object-cover w-24 h-24 rounded-full border theme-border"
            loading="eager"
            width="96"
            height="96"
          />
          <div class="absolute w-6 h-6 rounded-full -bottom-1 -right-1" aria-label="User is online" role="status">
            <div class="w-full h-full rounded-full theme-success-bg" />
          </div>
        </div>
        <div class="flex-1">
          <h3 :class="['mb-1 text-xl font-semibold font-srProDisplay', textClasses]">
            {{ user?.username || 'Guest User' }}
          </h3>
          <p :class="['mb-2 font-srProDisplay', textSecondaryClasses]">{{ user.email }}</p>
          <div :class="['flex items-center gap-4 text-sm', textSecondaryClasses]" role="list">
            <span class="flex items-center gap-1" role="listitem">
              <v-icon name="hi-shield-check" scale="0.9" aria-hidden="true" />
              {{
                user?.isVerified
                  ? $t('account.profile.verified')
                  : $t('account.profile.unverified')
              }}
            </span>
            <span class="flex items-center gap-1" role="listitem">
              <v-icon name="hi-badge-check" scale="0.9" aria-hidden="true" />
              {{ user?.role }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Profile Form -->
    <div
      v-show="isEditProfileOpen"
      class="transition-all duration-300 ease-in-out"
      :class="{
        'opacity-100 transform translate-y-0': isEditProfileOpen,
        'opacity-0 transform translate-y-2': !isEditProfileOpen,
      }"
    >
      <div
        class="p-6 border border-blue-100 rounded-lg dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20"
      >
        <form @submit.prevent="$emit('saveProfile')" class="space-y-6">
          <!-- Avatar Section -->
          <div class="flex items-center gap-6">
            <div class="relative group">
              <img
                :src="user?.avatar || '/images/User.png'"
                alt="User avatar"
                class="object-cover w-24 h-24 transition-all duration-200 rounded-full cursor-pointer group-hover:theme-surface group-hover:shadow-lg"
                @click="$emit('openAvatarSelector')"
              />
              <div class="absolute w-6 h-6 rounded-full -bottom-1 -right-1">
                <div class="w-full h-full rounded-full theme-success-bg" />
              </div>
            </div>
            <div>
              <h4 :class="['mb-1 font-medium font-srProDisplay', textClasses]">
                {{ $t('account.profile.editModal.avatarTitle') }}
              </h4>
              <p :class="['mb-2 text-sm font-srProDisplay', textSecondaryClasses]">
                {{ $t('account.profile.editModal.avatarDescription') }}
              </p>
              <Button
                type="button"
                @click="$emit('openAvatarSelector')"
                text-color="currentColor"
                bg-color="transparent"
                border-width="1px"
                width="auto"
                height="32px"
                :class="['px-3 text-sm', buttonOutlineClasses]"
              >
                <span :class="buttonTextClasses">{{ $t('account.profile.editModal.changeAvatarButton') }}</span>
              </Button>
            </div>
          </div>

          <!-- Form Fields -->
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <!-- Name field -->
            <div class="space-y-2">
              <label
                for="name"
                :class="['block text-sm font-medium font-srProDisplay', textClasses]"
              >
                {{ $t('account.profile.editModal.nameLabel') }}
              </label>
              <input
                type="text"
                id="name"
                :value="editableUser.name"
                @input="$emit('updateField', 'name', ($event.target as HTMLInputElement).value)"
                :class="['w-full px-4 py-3 transition-all duration-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 font-srProDisplay focus:shadow-lg', inputClasses]"
                :placeholder="$t('account.profile.editModal.namePlaceholder')"
              />
            </div>

            <!-- Email field (non-editable) -->
            <div class="space-y-2">
              <label
                for="email"
                :class="['block text-sm font-medium font-srProDisplay', textClasses]"
              >
                {{ $t('account.profile.editModal.emailLabel') }}
              </label>
              <input
                type="email"
                id="email"
                :value="user.email"
                disabled
                class="w-full px-4 py-3 text-blue-700 placeholder-blue-400 border border-blue-200 rounded-lg shadow-sm cursor-not-allowed dark:text-blue-300 dark:placeholder-blue-500 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 font-srProDisplay opacity-80"
                :placeholder="$t('account.profile.editModal.emailPlaceholder')"
              />
            </div>

            <!-- Location field (editable) -->
            <div class="space-y-2 md:col-span-2">
              <label
                for="location"
                :class="['block text-sm font-medium font-srProDisplay', textClasses]"
              >
                {{ $t('account.profile.editModal.locationLabel') }}
              </label>
              <input
                type="text"
                id="location"
                :value="editableUser.location"
                @input="$emit('updateField', 'location', ($event.target as HTMLInputElement).value)"
                :class="['w-full px-4 py-3 transition-all duration-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 font-srProDisplay focus:shadow-lg', inputClasses]"
                :placeholder="$t('account.profile.editModal.locationPlaceholder')"
              />
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <Button
              @click="$emit('cancelEdit')"
              type="button"
              text-color="currentColor"
              bg-color="transparent"
              border-width="1px"
              :class="['px-6 py-2 transition-all duration-200', buttonOutlineClasses]"
            >
              <span :class="buttonTextClasses">{{ $t('account.profile.editModal.cancelButton') }}</span>
            </Button>
            <button
              type="submit"
              :class="['px-6 py-2 transition-all duration-200 shadow-lg hover:shadow-xl rounded-md font-srProDisplay', buttonPrimaryClasses]"
            >
              {{ $t('account.profile.editModal.saveButton') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Button from '@/components/shared/Button.vue'

interface User {
  username?: string
  email?: string
  avatar?: string
  role?: string
  isVerified?: boolean
}

interface EditableUser {
  name: string
  email: string
  location: string
  avatar: string
  role: string
  isVerified: boolean
}

interface Props {
  sectionId: string
  user: User
  editableUser: EditableUser
  isEditProfileOpen: boolean
  sectionContainerClasses: string
  textClasses: string
  sectionHeaderClasses: string
  buttonOutlineClasses: string
  buttonTextClasses: string
  buttonPrimaryClasses: string
  textSecondaryClasses: string
  inputClasses: string
}

defineProps<Props>()

defineEmits<{
  toggleEdit: []
  refreshProfile: []
  saveProfile: []
  cancelEdit: []
  openAvatarSelector: []
  updateField: [field: string, value: string]
}>()
</script>
