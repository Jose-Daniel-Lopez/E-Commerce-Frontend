<template>
  <div class="pt-[85px] lg:pt-0 bg-white dark:bg-gray-900 text-black dark:text-white animate-fadeInUp transition-colors duration-200">
    <!-- Debug Panel -->
    <div class="fixed bottom-4 right-4 z-50 max-w-[420px] w-full">
      <div class="p-4 border border-yellow-300 rounded-lg shadow-lg bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-700">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-bold text-yellow-800 dark:text-yellow-300">🛠️ Debug Panel</span>
          <button @click="showDebug = !showDebug" class="text-xs text-yellow-700 underline dark:text-yellow-400 focus:outline-none">
            {{ showDebug ? 'Hide' : 'Show' }}
          </button>
        </div>
        <transition name="fade-debug">
          <div v-show="showDebug" class="space-y-2 text-xs text-yellow-900 dark:text-yellow-200">
            <div><b>User:</b> {{ user }}</div>
            <div><b>Theme:</b> {{ themeStore.selectedTheme }}</div>
            <div><b>Wishlist Count:</b> {{ wishlistProducts.length }}</div>
            <div><b>Wishlist Product IDs:</b> {{ wishlistProducts.map(p => p.id).join(', ') }}</div>
            <div><b>Orders Count:</b> {{ orders.length }}</div>
            <div><b>Refunds Count:</b> {{ refunds.length }}</div>
            <div><b>Addresses Count:</b> {{ addresses.length }}</div>
            <div><b>Reviews Count:</b> {{ reviews.length }}</div>
            <div><b>Sections:</b> {{ sections.map(s => s.id).join(', ') }}</div>
          </div>
        </transition>
      </div>
    </div>
    <Wrapper class="py-8">
      <!-- Breadcrumb Navigation -->
      <BreadcrumbNav :breadcrumbs="breadcrumbs" />

      <!-- Page Header -->
      <section class="mx-auto mb-8 max-w-7xl">
        <h1 :class="['text-2xl font-semibold text-left font-srProDisplay', textClasses]">
          {{ $t('account.title') }}
        </h1>
      </section>

      <div class="mx-auto max-w-7xl">
        <div class="flex flex-col gap-8 lg:flex-row">
          <!-- Sidebar Navigation -->
          <aside class="self-start w-full mb-4 lg:w-1/4 lg:mb-0">
            <!-- Desktop Navigation -->
            <nav :class="['hidden p-6 rounded-lg shadow-lg lg:block', navClasses]">
              <h2 :class="['mb-4 text-lg font-extrabold tracking-tight uppercase font-srProDisplay', textClasses]">{{ $t('account.navigation') }}</h2>
              <ul class="space-y-1">
                <li v-for="section in sections" :key="section.id">
                  <a
                    :href="`#${section.id}`"
                    class="flex items-center px-3 py-3 text-sm text-gray-700 transition-all duration-200 border-l-4 border-transparent rounded-lg cursor-pointer dark:text-gray-300 group font-srProDisplay hover:bg-gradient-to-r hover:from-gray-50 dark:hover:from-gray-700 hover:to-gray-100 dark:hover:to-gray-600 hover:border-black dark:hover:border-white focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-500"
                  >
                    <v-icon
                      :name="section.icon"
                      scale="1.1"
                      class="mr-3 text-gray-500 transition-colors duration-200 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white"
                    />
                    <span
                      class="transition-all duration-200 group-hover:text-black dark:group-hover:text-white group-hover:font-semibold"
                      >{{ section.label }}</span
                    >
                  </a>
                </li>
              </ul>
            </nav>

            <!-- Mobile Navigation Toggle -->
            <button
              @click="toggleMobileNav"
              :class="['fixed z-50 p-3 transition-all duration-200 rounded-lg shadow-lg lg:hidden top-28 left-4 hover:shadow-xl', navClasses]"
            >
              <v-icon name="hi-menu" scale="1.2" class="text-black" />
            </button>

            <!-- Mobile Navigation Overlay -->
            <div
              v-if="isMobileNavOpen"
              class="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
              @click="closeMobileNav"
            ></div>

            <!-- Mobile Navigation Sidebar -->
            <nav
              :class="[
                'lg:hidden fixed top-0 left-0 h-full w-80 shadow-xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto',
                navClasses,
                isMobileNavOpen ? 'translate-x-0' : '-translate-x-full',
              ]"
            >
              <div class="p-6">
                <div class="flex items-center justify-between mb-6">
                  <h2 :class="['text-lg font-semibold font-srProDisplay', textClasses]">{{ $t('account.navigation') }}</h2>
                  <button @click="closeMobileNav" :class="['transition-colors cursor-pointer', linkClasses]">
                    <v-icon name="hi-x" scale="1.2" />
                  </button>
                </div>
                <ul class="space-y-1">
                  <li v-for="section in sections" :key="section.id">
                    <a
                      :href="`#${section.id}`"
                      @click="closeMobileNav"
                      class="flex items-center px-3 py-3 text-sm text-gray-700 transition-all duration-200 border-l-4 border-transparent rounded-lg cursor-pointer dark:text-gray-300 group font-srProDisplay hover:bg-gradient-to-r hover:from-gray-50 dark:hover:from-gray-700 hover:to-gray-100 dark:hover:to-gray-600 hover:border-black dark:hover:border-white"
                    >
                      <v-icon
                        :name="section.icon"
                        scale="1.1"
                        class="mr-3 text-gray-500 transition-colors duration-200 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white"
                      />
                      <span
                        class="transition-all duration-200 group-hover:text-black dark:group-hover:text-white group-hover:font-medium"
                        >{{ section.label }}</span
                      >
                    </a>
                  </li>
                </ul>
              </div>
            </nav>
          </aside>

          <!-- Main Content -->
          <main class="flex-1 space-y-8 lg:ml-0">
            <!-- Profile Section -->
            <section
              :id="sections[0].id"
              :class="['p-6 shadow-md rounded-2xl', cardClasses]"
            >
              <div class="flex items-center justify-between mb-6">
                <h2 :class="['text-xl font-semibold font-srProDisplay', textClasses]">
                <span class="text-base font-bold tracking-tight text-gray-700 uppercase dark:text-gray-300">{{ $t('account.profile.title') }}</span>
                </h2>
                <div class="flex gap-2">
                  <!-- Agrupamos los botones -->
                  <Button
                    @click="toggleEditProfile"
                    :class="['px-4 transition-all duration-200', buttonOutlineClasses]"
                    text-color="currentColor"
                    bg-color="transparent"
                    border-width="1px"
                    width="auto"
                    height="36px"
                  >
                    <v-icon
                      :name="isEditProfileOpen ? 'hi-x' : 'hi-pencil'"
                      scale="0.9"
                      class="mr-2 transition-transform duration-200"
                      :class="{ 'rotate-90': isEditProfileOpen }"
                    />
                    <span :class="buttonTextClasses">{{
                      isEditProfileOpen
                        ? $t('account.profile.cancelButton')
                        : $t('account.profile.editButton')
                    }}</span>
                  </Button>
                  <!-- Nuevo botón de refrescar -->
                  <Button
                    @click="refreshProfile"
                    :class="['px-4 transition-all duration-200', buttonOutlineClasses]"
                    text-color="currentColor"
                    bg-color="transparent"
                    border-width="1px"
                    width="auto"
                    height="36px"
                  >
                    <v-icon name="hi-refresh" scale="0.9" class="mr-2" />
                    <!-- Asume que tienes un icono de refresh -->
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
              >
                <div class="flex flex-col items-start gap-6 md:flex-row">
                  <div class="relative">
                    <img
                      :src="authStore.user?.avatar || '/images/User.png'"
                      alt="User avatar"
                      class="object-cover w-24 h-24 border-2 border-gray-200 rounded-full"
                    />
                    <div
                      class="absolute w-6 h-6 bg-green-500 border-2 border-white rounded-full -bottom-1 -right-1"
                    ></div>
                  </div>
                  <div class="flex-1">
                    <h3 class="mb-1 text-xl font-semibold text-black font-srProDisplay">
                      {{ user?.username }}
                    </h3>
                    <p class="mb-2 text-gray-600 font-srProDisplay">{{ user.email }}</p>
                    <div class="flex items-center gap-4 text-sm text-gray-500">
                      <span class="flex items-center gap-1">
                        <v-icon name="hi-shield-check" scale="0.9" />
                        {{
                          authStore.user?.isVerified
                            ? $t('account.profile.verified')
                            : $t('account.profile.unverified')
                        }}
                      </span>
                      <span class="flex items-center gap-1">
                        <v-icon name="hi-badge-check" scale="0.9" />
                        {{ authStore.user?.role }}
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
                  <form @submit.prevent="saveProfile" class="space-y-6">
                    <!-- Avatar Section -->
                    <div class="flex items-center gap-6">
                      <div class="relative group">
                        <img
                          :src="authStore.user?.avatar || '/images/User.png'"
                          alt="User avatar"
                          class="object-cover w-24 h-24 transition-all duration-200 border-2 border-gray-200 rounded-full cursor-pointer group-hover:border-blue-400 group-hover:shadow-lg"
                          @click="openAvatarSelector"
                        />
                        <div
                          class="absolute w-6 h-6 bg-green-500 border-2 border-white rounded-full -bottom-1 -right-1"
                        ></div>
                      </div>
                      <div>
                        <h4 class="mb-1 font-medium text-black font-srProDisplay">
                          {{ $t('account.profile.editModal.avatarTitle') }}
                        </h4>
                        <p class="mb-2 text-sm text-gray-600 dark:text-gray-300 font-srProDisplay">
                          {{ $t('account.profile.editModal.avatarDescription') }}
                        </p>
                        <Button
                          type="button"
                          @click="openAvatarSelector"
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
                          class="block text-sm font-medium text-gray-700 dark:text-gray-300 font-srProDisplay"
                        >
                          {{ $t('account.profile.editModal.nameLabel') }}
                        </label>
                        <input
                          type="text"
                          id="name"
                          v-model="editableUser.name"
                          class="w-full px-4 py-3 text-black placeholder-gray-400 transition-all duration-200 bg-white border border-gray-300 rounded-lg shadow-sm dark:text-white dark:placeholder-gray-500 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 focus:border-blue-600 dark:focus:border-blue-400 font-srProDisplay focus:shadow-lg"
                          :placeholder="$t('account.profile.editModal.namePlaceholder')"
                        />
                      </div>

                      <!-- Email field (non-editable) -->
                      <div class="space-y-2">
                        <label
                          for="email"
                          class="block text-sm font-medium text-gray-700 dark:text-gray-300 font-srProDisplay"
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
                          class="block text-sm font-medium text-gray-700 dark:text-gray-300 font-srProDisplay"
                        >
                          {{ $t('account.profile.editModal.locationLabel') }}
                        </label>
                        <input
                          type="text"
                          id="location"
                          v-model="editableUser.location"
                          class="w-full px-4 py-3 text-black placeholder-gray-400 transition-all duration-200 bg-white border border-gray-300 rounded-lg shadow-sm dark:text-white dark:placeholder-gray-500 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 focus:border-blue-600 dark:focus:border-blue-400 font-srProDisplay focus:shadow-lg"
                          :placeholder="$t('account.profile.editModal.locationPlaceholder')"
                        />
                      </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                      <Button
                        @click="cancelEdit"
                        type="button"
                        text-color="currentColor"
                        bg-color="transparent"
                        border-width="1px"
                        :class="['px-6 py-2 transition-all duration-200', buttonOutlineClasses]"
                      >
                        <span :class="buttonTextClasses">{{ $t('account.profile.editModal.cancelButton') }}</span>
                      </Button>
                      <Button
                        type="submit"
                        class="px-6 py-2 text-white transition-all duration-200 bg-black shadow-lg hover:shadow-xl dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100"
                        text-color="currentColor"
                        bg-color="transparent"
                      >
                        {{ $t('account.profile.editModal.saveButton') }}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </section>

            <!-- Orders Section -->
            <section
              :id="sections[1].id"
              :class="['p-6 shadow-md rounded-2xl', cardClasses]"
            >
              <div class="flex items-center justify-between mb-6">
                <h2 :class="['text-xl font-semibold font-srProDisplay', textClasses]">
                <span class="text-base font-bold tracking-tight text-gray-700 uppercase dark:text-gray-300">{{ $t('account.orders.title') }}</span>
                </h2>
                <router-link
                  to="/orders"
                  :class="['text-sm font-medium transition-colors', linkClasses]"
                >
                  {{ $t('account.orders.viewAll') }}
                </router-link>
              </div>
              <div class="space-y-4">
                <div v-if="orders.length === 0" class="py-8 text-center">
                  <v-icon name="hi-clipboard-list" scale="2" class="mb-4 text-gray-300 opacity-80" />
                  <p class="text-base text-gray-500 font-srProDisplay">{{ $t('account.orders.emptyMessage') }}</p>
                </div>
                <div v-else>
                  <div
                    v-for="order in orders"
                    :key="order.id"
                    class="flex items-center justify-between p-4 transition-all duration-200 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 hover:shadow-lg hover:bg-white dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500"
                  >
                    <div class="flex items-center gap-4">
                      <div class="flex items-center justify-center w-10 h-10 bg-black rounded-lg">
                        <v-icon name="hi-clipboard-list" scale="1.2" class="text-white" />
                      </div>
                      <div>
                        <p class="font-medium text-black font-srProDisplay">
                          {{ $t('account.orders.order') }} #{{ order.id }}
                        </p>
                        <p class="text-sm text-gray-600 font-srProDisplay">{{ order.date }}</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-4">
                      <span
                        :class="getStatusColor(order.status)"
                        class="px-3 py-1 text-sm font-medium rounded-full"
                      >
                        {{ order.status }}
                      </span>
                      <Button
                        @click="openOrderDetailsModal(order)"
                        bg-color="transparent"
                        width="auto"
                        height="auto"
                        class="px-4 text-[10px] font-light text-gray-500 cursor-pointer hover:text-black transition-colors"
                      >
                        {{ $t('account.orders.viewDetails') }}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Resto de las secciones permanecen igual... -->
            <!-- Refunds and Returns Section -->
            <section
              :id="sections[2].id"
              :class="['p-6 shadow-md rounded-2xl', cardClasses]"
            >
              <div class="flex items-center justify-between mb-6">
                <h2 :class="['text-xl font-semibold font-srProDisplay', textClasses]">
                <span class="text-base font-bold tracking-tight text-gray-700 uppercase dark:text-gray-300">{{ $t('account.refunds.title') }}</span>
                </h2>
              </div>
              <div v-if="refunds.length === 0" class="py-8 text-center">
                <v-icon name="hi-arrow-left" scale="2" class="mb-4 text-gray-300 dark:text-gray-600 opacity-80" />
                <p class="text-base text-gray-500 dark:text-gray-400 font-srProDisplay">{{ $t('account.refunds.empty') }}</p>
              </div>
              <div v-else class="space-y-4">
                <div
                  v-for="refund in refunds"
                  :key="refund.id"
                  class="flex items-center justify-between p-4 transition-all duration-200 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 hover:shadow-lg hover:bg-white dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500"
                >
                  <div class="flex items-center gap-4">
                    <div
                      class="flex items-center justify-center w-10 h-10 bg-orange-500 rounded-lg"
                    >
                      <v-icon name="hi-arrow-left" scale="1.2" class="text-white" />
                    </div>
                    <div>
                      <p class="font-medium text-black font-srProDisplay">
                        {{ refund.status === 'Returned' ? 'Return' : 'Refund' }} #{{ refund.id }}
                      </p>
                      <p class="text-sm text-gray-600 font-srProDisplay">{{ refund.date }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-4">
                    <span
                      :class="getRefundStatusColor(refund.status)"
                      class="px-3 py-1 text-sm font-medium rounded-full"
                    >
                      {{ refund.status }}
                    </span>
                    <Button
                      @click="openOrderDetailsModal(refund)"
                      bg-color="transparent"
                      width="auto"
                      height="auto"
                      class="px-4 text-[10px] font-light text-gray-500 cursor-pointer hover:text-black transition-colors"
                    >
                      {{ $t('account.refunds.viewDetails') }}
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            <!-- Wishlist Section -->
            <section
              :id="sections[3].id"
              :class="['p-6 shadow-md rounded-2xl', cardClasses]"
            >
              <div class="flex items-center justify-between mb-6">
                <h2 :class="['text-xl font-semibold font-srProDisplay', textClasses]">
                <span class="text-base font-bold tracking-tight text-gray-700 uppercase dark:text-gray-300">{{ $t('account.wishlist.title') }}</span>
                </h2>
                <router-link
                  to="/wishlist"
                  :class="['text-sm font-medium transition-colors', linkClasses]"
                >
                  {{ $t('account.wishlist.viewAll') }}
                </router-link>
              </div>

              <!-- Loading state for wishlist -->
              <div v-if="wishlistLoading" class="flex items-center justify-center py-8">
                <div class="w-8 h-8 border-b-2 border-black rounded-full dark:border-white animate-spin opacity-70"></div>
              </div>

              <!-- Error state for wishlist -->
              <div v-else-if="wishlistError" class="p-4 border border-red-200 rounded-lg dark:border-red-800 bg-red-50 dark:bg-red-900/20">
                <p class="text-sm font-semibold text-red-700 dark:text-red-400">{{ wishlistError }}</p>
              </div>

              <!-- Empty state when no wishlist items are available -->
              <div v-else-if="wishlistProducts.length === 0" class="py-8 text-center">
                <v-icon name="hi-heart" scale="2" class="mb-4 text-gray-300 dark:text-gray-600 opacity-80" />
                <p class="text-base text-gray-500 dark:text-gray-400 font-srProDisplay">{{ $t('account.wishlist.emptyMessage') }}</p>
              </div>

              <!-- Display grid of wishlist items -->
              <div v-else class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div
                  v-for="item in wishlistProducts"
                  :key="item.id"
                  :class="['flex items-center gap-4 p-4 transition-all duration-200 border border-gray-200 dark:border-gray-600 rounded-xl group bg-gray-50 dark:bg-gray-800', hoverClasses]"
                >
                  <div class="relative">
                    <router-link
                      :to="`/products/${item.id}`"
                      class="block"
                    >
                      <img
                        :src="item.imageUrl"
                        :alt="item.name"
                        class="object-contain w-16 h-16 p-2 transition-transform rounded-lg hover:scale-105"
                      />
                    </router-link>
                    <button
                      class="absolute flex items-center justify-center w-6 h-6 transition-opacity bg-red-500 rounded-full opacity-0 cursor-pointer -top-2 -right-2 group-hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-300 hover:bg-red-600"
                      aria-label="Eliminar de wishlist"
                      tabindex="0"
                      type="button"
                    >
                      <v-icon name="hi-x" scale="0.8" class="text-white" />
                    </button>
                  </div>
                  <div class="flex-1">
                    <h4 class="text-sm font-medium text-black font-srProDisplay line-clamp-2">
                      {{ item.name }}
                    </h4>
                    <p class="mt-1 text-lg font-semibold text-black font-srProDisplay">
                      ${{ item.basePrice.toFixed(2) }}
                    </p>
                  </div>
                  <Button
                    text-color="white"
                    bg-color="black"
                    hover-bg-color="#333333"
                    width="auto"
                    height="32px"
                    class="px-3 text-sm"
                  >
                    {{ $t('account.wishlist.addToCart') }}
                  </Button>
                </div>
              </div>
            </section>

            <!-- Addresses Section -->
            <section
              :id="sections[4].id"
              :class="['p-6 shadow-md rounded-2xl', cardClasses]"
            >
              <div class="flex items-center justify-between mb-6">
                <h2 :class="['text-xl font-semibold font-srProDisplay', textClasses]">
                <span class="text-base font-bold tracking-tight text-gray-700 uppercase dark:text-gray-300">{{ $t('account.addresses.title') }}</span>
                </h2>
                <div class="flex gap-2">
                  <Button
                    @click="refreshAddresses"
                    :class="['px-4', buttonOutlineClasses]"
                    text-color="currentColor"
                    bg-color="transparent"
                    border-width="1px"
                    width="auto"
                    height="36px"
                  >
                    <v-icon name="hi-refresh" scale="0.9" class="mr-2" />
                    <span :class="buttonTextClasses">Refresh</span>
                  </Button>
                  <Button
                    :class="['px-4', buttonOutlineClasses]"
                    text-color="currentColor"
                    bg-color="transparent"
                    border-width="1px"
                    width="auto"
                    height="36px"
                  >
                    <v-icon name="hi-plus" scale="0.9" class="mr-2" />
                    <span :class="buttonTextClasses">{{ $t('account.addresses.addButton') }}</span>
                  </Button>
                </div>
              </div>

              <!-- Loading state for addresses -->
              <div v-if="addressesLoading" class="flex items-center justify-center py-8">
                <div class="w-8 h-8 border-b-2 border-black rounded-full dark:border-white animate-spin opacity-70"></div>
                <span class="ml-3 font-medium text-gray-600 dark:text-gray-300">Loading addresses...</span>
              </div>

              <!-- Error state for addresses -->
              <div
                v-else-if="addressesError"
                class="p-4 border border-red-200 rounded-lg dark:border-red-800 bg-red-50 dark:bg-red-900/20"
              >
                <p class="font-semibold text-red-700 dark:text-red-400">{{ addressesError }}</p>
                <Button
                  @click="refreshAddresses"
                  class="px-3 mt-2 text-sm font-semibold text-red-600 transition-colors duration-200 bg-transparent border border-red-600 dark:border-red-400 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  text-color="currentColor"
                  bg-color="transparent"
                  border-width="1px"
                  width="auto"
                  height="32px"
                >
                  Retry
                </Button>
              </div>

              <!-- Empty state when no addresses are available -->
              <div v-else-if="addresses.length === 0" class="py-8 text-center">
                <v-icon name="hi-location-marker" scale="2" class="mb-3 text-gray-400 dark:text-gray-600 opacity-80" />
                <p class="mb-4 text-base text-gray-600 dark:text-gray-300 font-srProDisplay">You have no saved addresses</p>
                <Button
                  class="px-4 font-semibold text-white transition-colors duration-200 bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100"
                  text-color="currentColor"
                  bg-color="transparent"
                  width="auto"
                  height="36px"
                >
                  <v-icon name="hi-plus" scale="0.9" class="mr-2" />
                  Add your first address
                </Button>
              </div>

              <!-- Display grid of user addresses -->
              <div v-else class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div
                  v-for="address in addresses"
                  :key="address.id"
                  :class="['p-4 transition-all duration-200 border border-gray-200 dark:border-gray-600 rounded-xl group bg-gray-50 dark:bg-gray-800', hoverClasses]"
                >
                  <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center gap-2">
                      <v-icon name="hi-location-marker" scale="1.1" class="text-gray-500" />
                      <!-- Address Name -->
                      <h4 class="font-semibold text-black font-srProDisplay">
                        {{ address.name }}
                      </h4>
                    </div>
                    <div class="flex gap-1 transition-opacity opacity-0 group-hover:opacity-100">
                      <button
                        class="p-1 text-gray-500 transition-colors rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-300 hover:bg-gray-100 hover:text-black"
                        aria-label="Editar dirección"
                        tabindex="0"
                      >
                        <v-icon name="hi-pencil" scale="0.9" />
                      </button>
                      <button
                        class="p-1 text-gray-500 transition-colors rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-300 hover:bg-red-50 hover:text-red-600"
                        aria-label="Eliminar dirección"
                        tabindex="0"
                      >
                        <v-icon name="hi-trash" scale="0.9" />
                      </button>
                    </div>
                  </div>

                  <!-- Display all address fields from the API -->
                  <p class="text-sm leading-relaxed text-gray-600 font-srProDisplay">
                    {{ address.street }}<br />
                    {{ address.city }}, {{ address.state }} {{ address.zipCode }}<br />
                    {{ address.country }}
                  </p>
                </div>
              </div>
            </section>

            <!-- Reviews Section -->
            <section
              :id="sections[5].id"
              :class="['p-6 shadow-md rounded-2xl', cardClasses]"
            >
              <div class="flex items-center justify-between mb-6">
                <h2 :class="['text-xl font-semibold font-srProDisplay', textClasses]">
                <span class="text-base font-bold tracking-tight text-gray-700 uppercase dark:text-gray-300">{{ $t('account.reviews.title') }}</span>
                </h2>
                <span class="text-sm font-medium text-gray-600 dark:text-gray-300"
                  >{{ reviews.length }} {{ $t('account.reviews.reviews') }}</span
                >
              </div>
              <div class="space-y-4">
                <div v-if="reviewsLoading" class="py-4 text-center text-gray-500 dark:text-gray-400">
                  <span class="font-medium opacity-80">Loading reviews...</span>
                </div>
                <div v-else-if="reviewsError" class="p-4 text-red-700 border border-red-200 rounded-lg dark:text-red-400 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
                  <span class="font-semibold">{{ reviewsError }}</span>
                </div>
                <div v-else-if="reviews.length === 0" class="py-8 text-center">
                  <v-icon name="hi-annotation" scale="2" class="mb-4 text-gray-300 dark:text-gray-600 opacity-80" />
                  <p class="text-base text-gray-500 dark:text-gray-400 font-srProDisplay">{{ $t('account.reviews.empty') }}</p>
                </div>
                <div
                  v-else
                  v-for="review in reviews"
                  :key="review.id"
                  :class="['p-4 transition-all duration-200 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800', hoverClasses]"
                >
                  <div class="flex items-start justify-between mb-3">
                    <div>
                      <span :class="['font-semibold', textClasses]">{{ review.product }}</span>
                      <span class="ml-2 text-yellow-500 dark:text-yellow-400">{{ '★'.repeat(review.rating) }}</span>
                    </div>
                    <span class="text-xs text-gray-500 dark:text-gray-400">{{ review.date }}</span>
                  </div>
                  <p class="text-sm leading-relaxed text-gray-700 dark:text-gray-300 font-srProDisplay">
                    {{ review.comment }}
                  </p>
                </div>
              </div>
            </section>

            <!-- Settings Section -->
            <section
              :id="sections[6].id"
              :class="['p-6 shadow-md rounded-2xl', cardClasses]"
            >
              <h2 :class="['mb-6 text-xl font-semibold font-srProDisplay', textClasses]">
                <span class="text-base font-bold tracking-tight text-gray-700 uppercase dark:text-gray-300">{{ $t('account.settings.title') }}</span>
              </h2>
              <div class="space-y-6">
                <!-- Language Setting -->
                <div class="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div class="flex items-center gap-3">
                    <div class="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-lg">
                      <v-icon name="hi-globe" scale="1.2" class="text-white" />
                    </div>
                    <div>
                      <h4 :class="['font-medium font-srProDisplay', textClasses]">
                        {{ $t('account.settings.language.title') }}
                      </h4>
                      <p class="text-sm text-gray-600 dark:text-gray-300 font-srProDisplay">
                        {{ $t('account.settings.language.description') }}
                      </p>
                    </div>
                  </div>
                  <select
                    :value="currentLocale.code"
                    @change="changeLanguage(($event.target as HTMLSelectElement).value)"
                    class="px-3 py-2 text-sm text-black placeholder-gray-400 transition-all duration-200 bg-white border border-gray-300 rounded-lg cursor-pointer dark:placeholder-gray-500 dark:border-gray-600 font-srProDisplay dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 focus:border-blue-600 dark:focus:border-blue-400 focus:shadow-lg"
                  >
                    <option v-for="locale in availableLocales" :key="locale.code" :value="locale.code">
                      {{ locale.name }}
                    </option>
                  </select>
                </div>

                <!-- App Theme Setting -->
                <div class="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div class="flex items-center gap-3">
                    <div class="flex items-center justify-center w-10 h-10 bg-gray-800 rounded-lg dark:bg-gray-600">
                      <v-icon name="hi-color-swatch" scale="1.2" class="text-white" />
                    </div>
                    <div>
                      <h4 :class="['font-medium font-srProDisplay', textClasses]">
                        {{ $t('account.settings.theme.title') }}
                      </h4>
                      <p class="text-sm text-gray-600 dark:text-gray-300 font-srProDisplay">
                        {{ $t('account.settings.theme.description') }}
                      </p>
                      <!-- Current theme indicator -->
                      <p class="mt-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                        Current: {{ themeStore.selectedTheme === 'system' ? `System (${themeStore.effectiveTheme})` : themeStore.selectedTheme }}
                      </p>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="relative group">
                      <button
                        @click="setTheme('light')"
                        :class="[
                          themeButtonBaseClasses,
                          themeStore.selectedTheme === 'light' ? themeButtonActiveClasses : themeButtonInactiveClasses
                        ]"
                        aria-label="Tema claro"
                        tabindex="0"
                      >
                        <v-icon name="hi-sun" class="w-4 h-4" />
                      </button>
                      <!-- Tooltip -->
                      <div class="absolute z-10 px-2 py-1 mb-2 text-xs text-white transition-opacity duration-200 transform -translate-x-1/2 bg-gray-900 rounded opacity-0 pointer-events-none bottom-full left-1/2 group-hover:opacity-100 whitespace-nowrap">
                        Light theme
                      </div>
                    </div>

                    <div class="relative group">
                      <button
                        @click="setTheme('dark')"
                        :class="[
                          themeButtonBaseClasses,
                          themeStore.selectedTheme === 'dark' ? themeButtonActiveClasses : themeButtonInactiveClasses
                        ]"
                        aria-label="Tema oscuro"
                        tabindex="0"
                      >
                        <v-icon name="hi-moon" class="w-4 h-4" />
                      </button>
                      <!-- Tooltip -->
                      <div class="absolute z-10 px-2 py-1 mb-2 text-xs text-white transition-opacity duration-200 transform -translate-x-1/2 bg-gray-900 rounded opacity-0 pointer-events-none bottom-full left-1/2 group-hover:opacity-100 whitespace-nowrap">
                        Dark theme
                      </div>
                    </div>

                    <div class="relative group">
                      <button
                        @click="setTheme('system')"
                        :class="[
                          themeButtonBaseClasses,
                          themeStore.selectedTheme === 'system' ? themeButtonActiveClasses : themeButtonInactiveClasses
                        ]"
                        aria-label="Tema del sistema"
                        tabindex="0"
                      >
                        <v-icon name="hi-desktop-computer" class="w-4 h-4" />
                      </button>
                      <!-- Tooltip -->
                      <div class="absolute z-10 px-2 py-1 mb-2 text-xs text-white transition-opacity duration-200 transform -translate-x-1/2 bg-gray-900 rounded opacity-0 pointer-events-none bottom-full left-1/2 group-hover:opacity-100 whitespace-nowrap">
                        Follow system preference
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Security Setting -->
                <div class="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div class="flex items-center gap-3">
                    <div class="flex items-center justify-center w-10 h-10 bg-red-500 rounded-lg">
                      <v-icon name="hi-key" scale="1.2" class="text-white" />
                    </div>
                    <div>
                      <h4 :class="['font-medium font-srProDisplay', textClasses]">
                        {{ $t('account.settings.security.title') }}
                      </h4>
                      <p class="text-sm text-gray-600 dark:text-gray-300 font-srProDisplay">
                        {{ $t('account.settings.security.description') }}
                      </p>
                    </div>
                  </div>
                  <Button
                    :class="['px-4 text-sm transition-all duration-200', buttonOutlineClasses]"
                    text-color="currentColor"
                    bg-color="transparent"
                    border-width="1px"
                    width="auto"
                    height="36px"
                    @click="openChangePasswordModal"
                  >
                    <span :class="buttonTextClasses">{{ $t('account.settings.security.changePasswordButton') }}</span>
                  </Button>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </Wrapper>

    <!-- Order Details Modal -->
    <OrderDetailsModal
      :is-open="isOrderDetailsModalOpen"
      :order="selectedOrder"
      @close="closeOrderDetailsModal"
    />

    <!-- Avatar Selector Modal -->
    <AvatarSelector
      v-if="isAvatarSelectorOpen"
      :current-avatar="authStore.user?.avatar || ''"
      :user-name="authStore.user?.username || ''"
      :user-id="authStore.user?.id || 0"
      @close="closeAvatarSelector"
      @save="saveAvatar"
    />

    <!-- Change Password Modal -->
    <ChangePasswordModal
      v-if="isChangePasswordModalOpen"
      :is-open="isChangePasswordModalOpen"
      @close="closeChangePasswordModal"
      @success="onPasswordChangeSuccess"
    />
  </div>
</template>

<script setup lang="ts">
const showDebug = ref(false)
import '@/assets/base.css'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'
import type { User } from '@/stores/auth'
import { useI18n } from 'vue-i18n'
import { useLanguage } from '@/composables/useLanguage'
import { useThemeClasses } from '@/composables/useThemeClasses'
import Wrapper from '@/components/shared/Wrapper.vue'
import Button from '@/components/shared/Button.vue'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav.vue'
import OrderDetailsModal from '@/components/orders/OrderDetailsModal.vue'
import AvatarSelector from '@/components/users/AvatarSelector.vue'
import ChangePasswordModal from '@/components/users/ChangePasswordModal.vue'
import axios from '@/lib/axios'

// Language composable for global language sync
const { currentLocale, availableLocales, changeLanguage } = useLanguage()

// Theme classes composable for consistent styling
const { cardClasses, textClasses, navClasses, buttonOutlineClasses, buttonTextClasses, linkClasses, hoverClasses, themeButtonBaseClasses, themeButtonActiveClasses, themeButtonInactiveClasses } = useThemeClasses()

const { t } = useI18n()
const authStore = useAuthStore()
const usersStore = useUsersStore()

const breadcrumbs = computed(() => [
  { label: t('breadcrumbs.home'), to: '/' },
  { label: t('breadcrumbs.account'), to: '/account' },
])

const sections = computed(() => [
  { id: 'profile', label: t('account.profile.title'), icon: 'fa-user-circle' },
  { id: 'orders', label: t('account.orders.title'), icon: 'hi-clipboard-list' },
  { id: 'refunds', label: t('account.refunds.title'), icon: 'hi-arrow-left' },
  { id: 'wishlist', label: t('account.wishlist.title'), icon: 'hi-heart' },
  { id: 'addresses', label: t('account.addresses.title'), icon: 'hi-location-marker' },
  { id: 'reviews', label: t('account.reviews.title'), icon: 'bi-star-fill' },
  { id: 'settings', label: t('account.settings.title'), icon: 'hi-adjustments' },
])

// User state
const user = computed(() => (authStore.user ?? {}) as User)

// Orders state
import { useOrdersStore } from '@/stores/orders'
import { useWishlistStore } from '@/stores/wishlist'
import { useThemeStore } from '@/stores/theme'

const ordersStore = useOrdersStore()
const themeStore = useThemeStore()
const { wishlistProducts, wishlistLoading, wishlistError, fetchUserWishlist } = useWishlistStore()

// Reactive reference to orders from the store (excluding RETURNED and REFUNDED orders)
const orders = computed(() =>
  ordersStore.orders
    .filter(order => order.status !== 'RETURNED' && order.status !== 'REFUNDED')
    .map(order => ({
    id: order.id.toString(),
    date: new Date(order.orderDate).toISOString().split('T')[0],
    status: order.status === 'CANCELED' ? 'Cancelled' : order.status,
    expectedDelivery: 'N/A', // You can enhance this later if available
    items: order.orderItems?.map(item => ({
      id: item.id,
      name: item.product.name,
      description: item.product.description,
      image: '/images/default-product.png', // Placeholder; improve later
      price: item.unitPrice,
      quantity: item.quantity,
    })) || [],
    subtotal: order.orderItems?.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0) || 0,
    shipping: 0, // Add if available
    tax: 0, // Add if available
    discount: order.hasDiscount ? 10 : 0, // Mock or fetch from discountCode
    total: order.totalAmount,
    shippingAddress: {
      name: user.value?.username || '',
      street: 'N/A',
      city: 'N/A',
      state: 'N/A',
      zipCode: 'N/A',
      country: 'N/A'
    },
    billingAddress: {
      name: user.value?.username || '',
      street: 'N/A',
      city: 'N/A',
      state: 'N/A',
      zipCode: 'N/A',
      country: 'N/A'
    },
    paymentMethod: {
      type: order.payment?.paymentMethod || 'N/A',
      lastFour: '4242' // Mock for now
    },
    paymentStatus: order.payment?.paymentStatus || 'Pending',
    trackingNumber: 'TN' + order.id,
    carrier: 'UPS'
  }))
)

// Refunds state - computed from orders with RETURNED and REFUNDED status
const refunds = computed(() =>
  ordersStore.returnsAndRefunds.map(order => ({
      id: order.id.toString(),
      date: new Date(order.orderDate).toISOString().split('T')[0],
      status: order.status === 'RETURNED' ? 'Returned' : 'Refunded',
      expectedDelivery: 'N/A',
      items: order.orderItems?.map(item => ({
        id: item.id,
        name: item.product.name,
        description: item.product.description,
        image: '/images/default-product.png', // Placeholder; improve later
        price: item.unitPrice,
        quantity: item.quantity,
      })) || [],
      subtotal: order.orderItems?.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0) || 0,
      shipping: 0, // Add if available
      tax: 0, // Add if available
      discount: order.hasDiscount ? 10 : 0, // Mock or fetch from discountCode
      total: order.totalAmount,
      shippingAddress: {
        name: user.value?.username || '',
        street: 'N/A',
        city: 'N/A',
        state: 'N/A',
        zipCode: 'N/A',
        country: 'N/A'
      },
      billingAddress: {
        name: user.value?.username || '',
        street: 'N/A',
        city: 'N/A',
        state: 'N/A',
        zipCode: 'N/A',
        country: 'N/A'
      },
      paymentMethod: {
        type: order.payment?.paymentMethod || 'N/A',
        lastFour: '4242' // Mock for now
      },
      paymentStatus: order.payment?.paymentStatus || 'Pending',
      trackingNumber: 'TN' + order.id,
      carrier: 'UPS'
    }))
)

const addresses = computed(() => usersStore.userAddresses)
const addressesLoading = computed(() => usersStore.addressesLoading)
const addressesError = computed(() => usersStore.addressesError)

interface Review {
  id: number
  product: string
  rating: number
  comment: string
  date: string
}
const reviews = ref<Review[]>([])
const reviewsLoading = ref(false)
const reviewsError = ref('')

const fetchUserReviews = async (userId: number) => {
  reviewsLoading.value = true
  reviewsError.value = ''
  try {
    const res = await axios.get(`/users/${userId}/productReviews`)
    const rawReviews = res.data._embedded?.productReviews || []
    const reviewPromises = rawReviews.map(async (review: { id: number; rating: number; comment: string; createdAt: string; _links: { product: { href: string } } }) => {
      let productName = ''
      try {
        const productRes = await axios.get(review._links.product.href)
        productName = productRes.data.name
      } catch {
        productName = 'Unknown Product'
      }
      return {
        id: review.id,
        product: productName,
        rating: review.rating,
        comment: review.comment,
        date: new Date(review.createdAt).toLocaleDateString(),
      }
    })
    reviews.value = await Promise.all(reviewPromises)
  } catch (err: unknown) {
    reviewsError.value = (err as Error)?.message || 'Failed to load reviews.'
  } finally {
    reviewsLoading.value = false
  }
}

// Logic for the Edit Profile inline form
const isEditProfileOpen = ref(false)
const editableUser = ref({
  name: '',
  email: '',
  location: '', // Keep for form compatibility
  avatar: '',
  role: '',
  isVerified: false,
})

const toggleEditProfile = () => {
  isEditProfileOpen.value = !isEditProfileOpen.value
  if (isEditProfileOpen.value) {
    // Copy current data for editing (using authStore.user since it has the properties we need)
    editableUser.value = {
      name: authStore.user?.username || '',
      email: authStore.user?.email || '',
      location: authStore.user?.location || '',
      avatar: authStore.user?.avatar || '',
      role: authStore.user?.role || '',
      isVerified: authStore.user?.isVerified || false,
    }
  }
}

const cancelEdit = () => {
  isEditProfileOpen.value = false
  // Restore original data using authStore.user properties
  editableUser.value = {
    name: authStore.user?.username || '',
    email: authStore.user?.email || '',
    location: authStore.user?.location || '',
    avatar: authStore.user?.avatar || '',
    role: authStore.user?.role || '',
    isVerified: authStore.user?.isVerified || false,
  }
}

const saveProfile = async () => {
  // Save changes using the store
  if (authStore.user) {
    await authStore.updateUserProfile({
      username: editableUser.value.name,
      avatar: editableUser.value.avatar,
      location: editableUser.value.location,
    })
  }
  isEditProfileOpen.value = false
  // ...
}

// State for user settings
// const theme = ref('system') // Replaced by themeStore

// Logic for mobile navigation.
const isMobileNavOpen = ref(false)

// Order Details Modal state
const isOrderDetailsModalOpen = ref(false)
const isAvatarSelectorOpen = ref(false)
const isChangePasswordModalOpen = ref(false)
const selectedOrder = ref<OrderType>({
  id: '',
  date: '',
  status: '',
  expectedDelivery: '',
  items: [],
  subtotal: 0,
  shipping: 0,
  tax: 0,
  discount: 0,
  total: 0,
  shippingAddress: {
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  },
  billingAddress: {
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  },
  paymentMethod: {
    type: '',
    lastFour: '',
  },
  paymentStatus: '',
  trackingNumber: '',
  carrier: '',
})

const toggleMobileNav = () => {
  isMobileNavOpen.value = !isMobileNavOpen.value
  // Prevent body from scrolling when the mobile navigation is open.
  if (isMobileNavOpen.value) {
    document.body.classList.add('nav-open')
  } else {
    document.body.classList.remove('nav-open')
  }
}

const closeMobileNav = () => {
  isMobileNavOpen.value = false
  document.body.classList.remove('nav-open')
}

const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
  themeStore.setTheme(newTheme)
}

// Helper functions to determine status colors.
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Delivered':
      return 'bg-green-100 text-green-800'
    case 'Shipped':
      return 'bg-blue-100 text-blue-800'
    case 'Cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getRefundStatusColor = (status: string) => {
  switch (status) {
    case 'Completed':
    case 'Refunded':
      return 'bg-green-100 text-green-800'
    case 'Processing':
    case 'Returned':
      return 'bg-orange-100 text-orange-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const activeSection = ref('profile')

// Order Details Modal Methods
interface OrderItem {
  id: number
  name: string
  description: string
  image: string
  price: number
  quantity: number
}

interface Address {
  name: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface PaymentMethod {
  type: string
  lastFour: string
}

interface OrderType {
  id: string
  date: string
  status: string
  expectedDelivery: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
  shippingAddress: Address
  billingAddress: Address
  paymentMethod: PaymentMethod
  paymentStatus: string
  trackingNumber?: string
  carrier?: string
}

const openOrderDetailsModal = (order: OrderType) => {
  selectedOrder.value = order
  isOrderDetailsModalOpen.value = true
  // Prevent body scrolling when modal is open
  document.body.style.overflow = 'hidden'
}

const closeOrderDetailsModal = () => {
  isOrderDetailsModalOpen.value = false
  selectedOrder.value = {
    id: '',
    date: '',
    status: '',
    expectedDelivery: '',
    items: [],
    subtotal: 0,
    shipping: 0,
    tax: 0,
    discount: 0,
    total: 0,
    shippingAddress: {
      name: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
    billingAddress: {
      name: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
    paymentMethod: {
      type: '',
      lastFour: '',
    },
    paymentStatus: '',
    trackingNumber: '',
    carrier: '',
  }
  // Restore body scrolling
  document.body.style.overflow = 'auto'
}

// Avatar Selector Modal Methods
const openAvatarSelector = () => {
  isAvatarSelectorOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeAvatarSelector = () => {
  isAvatarSelectorOpen.value = false
  document.body.style.overflow = 'auto'
}

// Change Password Modal Methods
const openChangePasswordModal = () => {
  isChangePasswordModalOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeChangePasswordModal = () => {
  isChangePasswordModalOpen.value = false
  document.body.style.overflow = 'auto'
}

const onPasswordChangeSuccess = () => {
  // You can add any additional logic here if needed
  console.log('Password changed successfully!')
}

const saveAvatar = async (avatarUrl: string) => {
  try {
    // Update the user's avatar in the auth store
    if (authStore.user) {
      console.log('Saving avatar:', avatarUrl)
      console.log('Current user before update:', authStore.user)
      console.log('LocalStorage before update:', localStorage.getItem('user'))

      const result = await authStore.updateUserProfile({
        username: authStore.user.username,
        avatar: avatarUrl,
        location: authStore.user.location || ''
      })

      console.log('Update result:', result)

      if (result.success) {
        // Fetch fresh user data from server to ensure we have the latest
        await authStore.fetchCurrentUser()
        console.log('Current user after refresh:', authStore.user)
        console.log('LocalStorage after update:', localStorage.getItem('user'))

        // Update the editable user if edit mode is open
        if (isEditProfileOpen.value) {
          editableUser.value.avatar = avatarUrl
        }

        // Close the modal
        closeAvatarSelector()

        // Show success message (optional)
        console.log('Avatar updated successfully')
      } else {
        console.error('Failed to update avatar:', result.error)
        // You might want to show an error message to the user here
        alert(`Failed to update avatar: ${result.error}`)
      }
    }
  } catch (error) {
    console.error('Error saving avatar:', error)
    // You might want to show an error message to the user here
    alert('Error saving avatar. Please try again.')
  }
}

onMounted(async () => {
  // Theme initialization is now handled by the store in main.ts

  // Fetch user data from backend using auth store
  if (authStore.isAuthenticated && authStore.user?.id) {
    await authStore.fetchCurrentUser()
    await usersStore.fetchUserById(authStore.user.id)

    if (usersStore.selectedUser) {
      await usersStore.fetchUserAddresses(usersStore.selectedUser)
    }

    // ✅ Fetch user's orders using orders store
    await ordersStore.fetchOrdersByUser(authStore.user.id)
    // ✅ Fetch user's wishlist using wishlist store
    await fetchUserWishlist(authStore.user.id)
    await fetchUserReviews(authStore.user.id)
  }

  // Set up an observer to highlight the active navigation link based on the currently visible section.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id
        }
      })
    },
    { threshold: 0.5 },
  )

  sections.value.forEach((section) => {
    const element = document.getElementById(section.id)
    if (element) observer.observe(element)
  })
})

// Clean up side effects when the component is unmounted.
onUnmounted(() => {
  document.body.classList.remove('nav-open')
  // Restore body scrolling in case modal was open
  document.body.style.overflow = 'auto'
})

const refreshProfile = async () => {
  try {
    await authStore.fetchCurrentUser()
    // También refrescar las direcciones
    if (authStore.user?.id) {
      await usersStore.fetchUserById(authStore.user.id)
      if (usersStore.selectedUser) {
        await usersStore.fetchUserAddresses(usersStore.selectedUser)
      }
    }
  } catch (error) {
    console.error('Error al refrescar perfil:', error)
  }
}

const refreshAddresses = async () => {
  try {
    if (authStore.user?.id) {
      await usersStore.fetchUserById(authStore.user.id)
      if (usersStore.selectedUser) {
        await usersStore.fetchUserAddresses(usersStore.selectedUser)
      }
    }
  } catch (error) {
    console.error('Error al refrescar direcciones:', error)
  }
}
</script>

<style scoped>
/* Debug panel fade */
.fade-debug-enter-active, .fade-debug-leave-active {
  transition: opacity 0.2s;
}
.fade-debug-enter-from, .fade-debug-leave-to {
  opacity: 0;
}
</style>
