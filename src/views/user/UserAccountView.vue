<template>
  <div class="pt-[85px] lg:pt-0 bg-white text-black animate-fadeInUp">
    <Wrapper class="py-8">
      <!-- Breadcrumb Navigation -->
      <BreadcrumbNav :breadcrumbs="breadcrumbs" />

      <!-- Page Header -->
      <section class="max-w-7xl mx-auto mb-8">
        <h1 class="font-srProDisplay text-2xl font-semibold text-left text-black">
          {{ $t('account.title') }}
        </h1>
      </section>

      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Sidebar Navigation -->
          <aside class="w-full lg:w-1/4 mb-4 lg:mb-0 self-start">
            <!-- Desktop Navigation -->
            <nav class="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hidden lg:block">
              <h2 class="font-srProDisplay text-lg font-semibold text-black mb-4">Navigation</h2>
              <ul class="space-y-1">
                <li v-for="section in sections" :key="section.id">
                  <a
                    :href="`#${section.id}`"
                    class="group flex items-center px-3 py-3 text-sm font-srProDisplay text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 rounded-lg cursor-pointer transition-all duration-200 border-l-4 border-transparent hover:border-black"
                  >
                    <v-icon
                      :name="section.icon"
                      scale="1.1"
                      class="mr-3 text-gray-500 group-hover:text-black transition-colors duration-200"
                    />
                    <span
                      class="group-hover:text-black group-hover:font-medium transition-all duration-200"
                      >{{ section.label }}</span
                    >
                  </a>
                </li>
              </ul>
            </nav>

            <!-- Mobile Navigation Toggle -->
            <button
              @click="toggleMobileNav"
              class="lg:hidden fixed top-28 left-4 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-3 hover:shadow-xl transition-all duration-200"
            >
              <v-icon name="hi-menu" scale="1.2" class="text-black" />
            </button>

            <!-- Mobile Navigation Overlay -->
            <div
              v-if="isMobileNavOpen"
              class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
              @click="closeMobileNav"
            ></div>

            <!-- Mobile Navigation Sidebar -->
            <nav
              :class="[
                'lg:hidden fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto',
                isMobileNavOpen ? 'translate-x-0' : '-translate-x-full',
              ]"
            >
              <div class="p-6">
                <div class="flex items-center justify-between mb-6">
                  <h2 class="font-srProDisplay text-lg font-semibold text-black">Navigation</h2>
                  <button @click="closeMobileNav" class="text-gray-500 hover:text-black">
                    <v-icon name="hi-x" scale="1.2" />
                  </button>
                </div>
                <ul class="space-y-1">
                  <li v-for="section in sections" :key="section.id">
                    <a
                      :href="`#${section.id}`"
                      @click="closeMobileNav"
                      class="group flex items-center px-3 py-3 text-sm font-srProDisplay text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 rounded-lg cursor-pointer transition-all duration-200 border-l-4 border-transparent hover:border-black"
                    >
                      <v-icon
                        :name="section.icon"
                        scale="1.1"
                        class="mr-3 text-gray-500 group-hover:text-black transition-colors duration-200"
                      />
                      <span
                        class="group-hover:text-black group-hover:font-medium transition-all duration-200"
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
              class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div class="flex items-center justify-between mb-6">
                <h2 class="font-srProDisplay text-xl font-semibold text-black">
                  {{ $t('account.profile.title') }}
                </h2>
                <div class="flex gap-2">
                  <!-- Agrupamos los botones -->
                  <Button
                    @click="toggleEditProfile"
                    text-color="black"
                    bg-color="transparent"
                    border-width="1px"
                    border-color="#e5e7eb"
                    hover-bg-color="#f9fafb"
                    width="auto"
                    height="36px"
                    class="px-4 transition-all duration-200"
                  >
                    <v-icon
                      :name="isEditProfileOpen ? 'hi-x' : 'hi-pencil'"
                      scale="0.9"
                      class="mr-2 transition-transform duration-200"
                      :class="{ 'rotate-90': isEditProfileOpen }"
                    />
                    {{
                      isEditProfileOpen
                        ? $t('account.profile.cancelButton')
                        : $t('account.profile.editButton')
                    }}
                  </Button>
                  <!-- Nuevo botón de refrescar -->
                  <Button
                    @click="refreshProfile"
                    text-color="black"
                    bg-color="transparent"
                    border-width="1px"
                    border-color="#e5e7eb"
                    hover-bg-color="#f9fafb"
                    width="auto"
                    height="36px"
                    class="px-4 transition-all duration-200"
                  >
                    <v-icon name="hi-refresh" scale="0.9" class="mr-2" />
                    <!-- Asume que tienes un icono de refresh -->
                    Refrescar
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
                <div class="flex flex-col md:flex-row gap-6 items-start">
                  <div class="relative">
                    <img
                      :src="authStore.user?.avatar || '/images/User.png'"
                      alt="User avatar"
                      class="w-24 h-24 rounded-full border-2 border-gray-200 object-cover"
                    />
                    <div
                      class="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full"
                    ></div>
                  </div>
                  <div class="flex-1">
                    <h3 class="font-srProDisplay text-xl font-semibold text-black mb-1">
                      {{ user?.username }}
                    </h3>
                    <p class="font-srProDisplay text-gray-600 mb-2">{{ user.email }}</p>
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
                  class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200"
                >
                  <form @submit.prevent="saveProfile" class="space-y-6">
                    <!-- Avatar Section -->
                    <div class="flex items-center gap-6">
                      <div class="relative group">
                        <img
                          :src="authStore.user?.avatar || '/images/User.png'"
                          alt="User avatar"
                          class="w-24 h-24 rounded-full border-2 border-gray-200 group-hover:border-blue-400 transition-colors duration-200 object-cover"
                        />
                        <div
                          class="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full"
                        ></div>
                        <div
                          @click="openAvatarSelector"
                          class="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                        >
                          <v-icon name="hi-camera" scale="1.2" class="text-white" />
                        </div>
                      </div>
                      <div>
                        <h4 class="font-srProDisplay font-medium text-black mb-1">
                          {{ $t('account.profile.editModal.avatarTitle') }}
                        </h4>
                        <p class="font-srProDisplay text-sm text-gray-600 mb-2">
                          {{ $t('account.profile.editModal.avatarDescription') }}
                        </p>
                        <Button
                          type="button"
                          @click="openAvatarSelector"
                          text-color="blue-600"
                          bg-color="transparent"
                          border-width="1px"
                          border-color="#3b82f6"
                          hover-bg-color="#eff6ff"
                          width="auto"
                          height="32px"
                          class="px-3 text-sm"
                        >
                          {{ $t('account.profile.editModal.changeAvatarButton') }}
                        </Button>
                      </div>
                    </div>

                    <!-- Form Fields -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <!-- Name field -->
                      <div class="space-y-2">
                        <label
                          for="name"
                          class="block text-sm font-medium text-gray-700 font-srProDisplay"
                        >
                          {{ $t('account.profile.editModal.nameLabel') }}
                        </label>
                        <input
                          type="text"
                          id="name"
                          v-model="editableUser.name"
                          class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-srProDisplay"
                          :placeholder="$t('account.profile.editModal.namePlaceholder')"
                        />
                      </div>

                      <!-- Email field (non-editable) -->
                      <div class="space-y-2">
                        <label
                          for="email"
                          class="block text-sm font-medium text-gray-700 font-srProDisplay"
                        >
                          {{ $t('account.profile.editModal.emailLabel') }}
                        </label>
                        <input
                          type="email"
                          id="email"
                          :value="user.email"
                          disabled
                          class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-gray-50 text-gray-500 cursor-not-allowed font-srProDisplay"
                          :placeholder="$t('account.profile.editModal.emailPlaceholder')"
                        />
                      </div>

                      <!-- Location field (editable) -->
                      <div class="space-y-2 md:col-span-2">
                        <label
                          for="location"
                          class="block text-sm font-medium text-gray-700 font-srProDisplay"
                        >
                          {{ $t('account.profile.editModal.locationLabel') }}
                        </label>
                        <input
                          type="text"
                          id="location"
                          v-model="editableUser.location"
                          class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-srProDisplay"
                          :placeholder="$t('account.profile.editModal.locationPlaceholder')"
                        />
                      </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex justify-end gap-4 pt-4 border-t border-gray-200">
                      <Button
                        @click="cancelEdit"
                        type="button"
                        text-color="gray-600"
                        bg-color="transparent"
                        border-width="1px"
                        border-color="#d1d5db"
                        hover-bg-color="#f9fafb"
                        class="px-6 py-2 transition-all duration-200"
                      >
                        {{ $t('account.profile.editModal.cancelButton') }}
                      </Button>
                      <Button
                        type="submit"
                        text-color="white"
                        bg-color="black"
                        hover-bg-color="#333333"
                        class="px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-200"
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
              class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div class="flex items-center justify-between mb-6">
                <h2 class="font-srProDisplay text-xl font-semibold text-black">
                  {{ $t('account.orders.title') }}
                </h2>
                <router-link
                  to="/orders"
                  class="text-sm text-gray-600 hover:text-black transition-colors font-medium"
                >
                  {{ $t('account.orders.viewAll') }}
                </router-link>
              </div>
              <div class="space-y-4">
                <div
                  v-for="order in orders"
                  :key="order.id"
                  class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                      <v-icon name="hi-clipboard-list" scale="1.2" class="text-white" />
                    </div>
                    <div>
                      <p class="font-srProDisplay font-medium text-black">
                        {{ $t('account.orders.order') }} #{{ order.id }}
                      </p>
                      <p class="font-srProDisplay text-sm text-gray-600">{{ order.date }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-4">
                    <span
                      :class="getStatusColor(order.status)"
                      class="px-3 py-1 rounded-full text-sm font-medium"
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
            </section>

            <!-- Resto de las secciones permanecen igual... -->
            <!-- Refunds and Returns Section -->
            <section
              :id="sections[2].id"
              class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div class="flex items-center justify-between mb-6">
                <h2 class="font-srProDisplay text-xl font-semibold text-black">
                  {{ $t('account.refunds.title') }}
                </h2>
              </div>
              <div v-if="refunds.length === 0" class="text-center py-8">
                <v-icon name="hi-arrow-left" scale="2" class="text-gray-300 mb-4" />
                <p class="font-srProDisplay text-gray-500">No refunds or returns found</p>
              </div>
              <div v-else class="space-y-4">
                <div
                  v-for="refund in refunds"
                  :key="refund.id"
                  class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div class="flex items-center gap-4">
                    <div
                      class="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center"
                    >
                      <v-icon name="hi-arrow-left" scale="1.2" class="text-white" />
                    </div>
                    <div>
                      <p class="font-srProDisplay font-medium text-black">
                        {{ refund.status === 'Returned' ? 'Return' : 'Refund' }} #{{ refund.id }}
                      </p>
                      <p class="font-srProDisplay text-sm text-gray-600">{{ refund.date }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-4">
                    <span
                      :class="getRefundStatusColor(refund.status)"
                      class="px-3 py-1 rounded-full text-sm font-medium"
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
              class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div class="flex items-center justify-between mb-6">
                <h2 class="font-srProDisplay text-xl font-semibold text-black">
                  {{ $t('account.wishlist.title') }}
                </h2>
                <router-link
                  to="/wishlist"
                  class="text-sm text-gray-600 hover:text-black transition-colors font-medium"
                >
                  {{ $t('account.wishlist.viewAll') }}
                </router-link>
              </div>

              <!-- Loading state for wishlist -->
              <div v-if="wishlistLoading" class="flex items-center justify-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
              </div>

              <!-- Error state for wishlist -->
              <div v-else-if="wishlistError" class="bg-red-50 border border-red-200 rounded-lg p-4">
                <p class="text-red-700 text-sm">{{ wishlistError }}</p>
              </div>

              <!-- Empty state when no wishlist items are available -->
              <div v-else-if="wishlistProducts.length === 0" class="text-center py-8">
                <v-icon name="hi-heart" scale="2" class="text-gray-300 mb-4" />
                <p class="text-gray-500 text-lg font-medium mb-2">{{ $t('account.wishlist.empty.title') }}</p>
                <p class="text-gray-400 text-sm">{{ $t('account.wishlist.empty.description') }}</p>
              </div>

              <!-- Display grid of wishlist items -->
              <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  v-for="item in wishlistProducts"
                  :key="item.id"
                  class="group flex items-center gap-4 p-4 border border-gray-200 bg-gray-50 rounded-lg hover:shadow-md transition-all duration-200 hover:border-gray-300"
                >
                  <div class="relative">
                    <router-link
                      :to="`/products/${item.id}`"
                      class="block"
                    >
                      <img
                        :src="item.imageUrl"
                        :alt="item.name"
                        class="w-16 h-16 object-contain rounded-lg p-2 hover:scale-105 transition-transform"
                      />
                    </router-link>
                    <button
                      class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <v-icon name="hi-x" scale="0.8" class="text-white" />
                    </button>
                  </div>
                  <div class="flex-1">
                    <h4 class="font-srProDisplay font-medium text-black text-sm line-clamp-2">
                      {{ item.name }}
                    </h4>
                    <p class="font-srProDisplay text-lg font-semibold text-black mt-1">
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
              class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div class="flex items-center justify-between mb-6">
                <h2 class="font-srProDisplay text-xl font-semibold text-black">
                  {{ $t('account.addresses.title') }}
                </h2>
                <div class="flex gap-2">
                  <Button
                    @click="refreshAddresses"
                    text-color="black"
                    bg-color="transparent"
                    border-width="1px"
                    border-color="#e5e7eb"
                    hover-bg-color="#f9fafb"
                    width="auto"
                    height="36px"
                    class="px-4"
                  >
                    <v-icon name="hi-refresh" scale="0.9" class="mr-2" />
                    Refresh
                  </Button>
                  <Button
                    text-color="black"
                    bg-color="transparent"
                    border-width="1px"
                    border-color="#e5e7eb"
                    hover-bg-color="#f9fafb"
                    width="auto"
                    height="36px"
                    class="px-4"
                  >
                    <v-icon name="hi-plus" scale="0.9" class="mr-2" />
                    {{ $t('account.addresses.addButton') }}
                  </Button>
                </div>
              </div>

              <!-- Loading state for addresses -->
              <div v-if="addressesLoading" class="flex items-center justify-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                <span class="ml-3 text-gray-600">Loading addresses...</span>
              </div>

              <!-- Error state for addresses -->
              <div
                v-else-if="addressesError"
                class="bg-red-50 border border-red-200 rounded-lg p-4"
              >
                <p class="text-red-700">{{ addressesError }}</p>
                <Button
                  @click="refreshAddresses"
                  text-color="red-600"
                  bg-color="transparent"
                  border-width="1px"
                  border-color="#dc2626"
                  hover-bg-color="#fef2f2"
                  width="auto"
                  height="32px"
                  class="px-3 text-sm mt-2"
                >
                  Retry
                </Button>
              </div>

              <!-- Empty state when no addresses are available -->
              <div v-else-if="addresses.length === 0" class="text-center py-8">
                <v-icon name="hi-location-marker" scale="2" class="text-gray-400 mb-3" />
                <p class="text-gray-600 mb-4">You have no saved addresses</p>
                <Button
                  text-color="white"
                  bg-color="black"
                  hover-bg-color="#333333"
                  width="auto"
                  height="36px"
                  class="px-4"
                >
                  <v-icon name="hi-plus" scale="0.9" class="mr-2" />
                  Add your first address
                </Button>
              </div>

              <!-- Display grid of user addresses -->
              <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  v-for="address in addresses"
                  :key="address.id"
                  class="group border border-gray-200 bg-gray-50 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-gray-300"
                >
                  <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center gap-2">
                      <v-icon name="hi-location-marker" scale="1.1" class="text-gray-500" />
                      <!-- Address Name -->
                      <h4 class="font-srProDisplay font-semibold text-black">
                        {{ address.name }}
                      </h4>
                    </div>
                    <div class="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button class="p-1 text-gray-500 hover:text-black transition-colors">
                        <v-icon name="hi-pencil" scale="0.9" />
                      </button>
                      <button class="p-1 text-gray-500 hover:text-red-500 transition-colors">
                        <v-icon name="hi-trash" scale="0.9" />
                      </button>
                    </div>
                  </div>

                  <!-- Display all address fields from the API -->
                  <p class="font-srProDisplay text-gray-600 text-sm leading-relaxed">
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
              class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div class="flex items-center justify-between mb-6">
                <h2 class="font-srProDisplay text-xl font-semibold text-black">
                  {{ $t('account.reviews.title') }}
                </h2>
                <span class="text-sm text-gray-600 font-medium"
                  >{{ reviews.length }} {{ $t('account.reviews.reviews') }}</span
                >
              </div>
              <div class="space-y-4">
                <div v-if="reviewsLoading" class="py-4 text-center text-gray-500">
                  Loading reviews...
                </div>
                <div v-else-if="reviewsError" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                  {{ reviewsError }}
                </div>
                <div v-else-if="reviews.length === 0" class="py-4 text-center text-gray-500">
                  No reviews found.
                </div>
                <div
                  v-else
                  v-for="review in reviews"
                  :key="review.id"
                  class="border border-gray-200 bg-gray-50 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-gray-300"
                >
                  <div class="flex items-start justify-between mb-3">
                    <div>
                      <span class="font-semibold text-black">{{ review.product }}</span>
                      <span class="ml-2 text-yellow-500">{{ '★'.repeat(review.rating) }}</span>
                    </div>
                    <span class="text-xs text-gray-500">{{ review.date }}</span>
                  </div>
                  <p class="font-srProDisplay text-gray-700 text-sm leading-relaxed">
                    {{ review.comment }}
                  </p>
                </div>
              </div>
            </section>

            <!-- Settings Section -->
            <section
              :id="sections[6].id"
              class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <h2 class="font-srProDisplay text-xl font-semibold text-black mb-6">
                {{ $t('account.settings.title') }}
              </h2>
              <div class="space-y-6">
                <!-- Language Setting -->
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <v-icon name="hi-globe" scale="1.2" class="text-white" />
                    </div>
                    <div>
                      <h4 class="font-srProDisplay font-medium text-black">
                        {{ $t('account.settings.language.title') }}
                      </h4>
                      <p class="font-srProDisplay text-sm text-gray-600">
                        {{ $t('account.settings.language.description') }}
                      </p>
                    </div>
                  </div>
                  <select
                    v-model="selectedLanguage"
                    class="px-3 py-2 border border-gray-300 rounded-lg font-srProDisplay text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>

                <!-- App Theme Setting -->
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                      <v-icon name="hi-color-swatch" scale="1.2" class="text-white" />
                    </div>
                    <div>
                      <h4 class="font-srProDisplay font-medium text-black">
                        {{ $t('account.settings.theme.title') }}
                      </h4>
                      <p class="font-srProDisplay text-sm text-gray-600">
                        {{ $t('account.settings.theme.description') }}
                      </p>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <button
                      @click="setTheme('light')"
                      :class="[
                        'p-2 rounded-lg',
                        theme === 'light' ? 'bg-black text-white' : 'bg-gray-200 text-black',
                      ]"
                    >
                      <v-icon name="hi-sun" />
                    </button>
                    <button
                      @click="setTheme('dark')"
                      :class="[
                        'p-2 rounded-lg',
                        theme === 'dark' ? 'bg-black text-white' : 'bg-gray-200 text-black',
                      ]"
                    >
                      <v-icon name="hi-moon" />
                    </button>
                    <button
                      @click="setTheme('system')"
                      :class="[
                        'p-2 rounded-lg',
                        theme === 'system' ? 'bg-black text-white' : 'bg-gray-200 text-black',
                      ]"
                    >
                      <v-icon name="hi-chip" />
                    </button>
                  </div>
                </div>

                <!-- Notifications Setting -->
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <v-icon name="hi-chat" scale="1.2" class="text-white" />
                    </div>
                    <div>
                      <h4 class="font-srProDisplay font-medium text-black">
                        {{ $t('account.settings.notifications.title') }}
                      </h4>
                      <p class="font-srProDisplay text-sm text-gray-600">
                        {{ $t('account.settings.notifications.description') }}
                      </p>
                    </div>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="notifications.enabled" class="sr-only peer" />
                    <div
                      class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"
                    ></div>
                  </label>
                </div>

                <!-- Security Setting -->
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                      <v-icon name="hi-key" scale="1.2" class="text-white" />
                    </div>
                    <div>
                      <h4 class="font-srProDisplay font-medium text-black">
                        {{ $t('account.settings.security.title') }}
                      </h4>
                      <p class="font-srProDisplay text-sm text-gray-600">
                        {{ $t('account.settings.security.description') }}
                      </p>
                    </div>
                  </div>
                  <Button
                    text-color="black"
                    bg-color="transparent"
                    border-width="1px"
                    border-color="#e5e7eb"
                    hover-bg-color="#f9fafb"
                    width="auto"
                    height="36px"
                    class="px-4 text-sm"
                  >
                    {{ $t('account.settings.security.changePasswordButton') }}
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
  </div>
</template>

<script setup lang="ts">
import '@/assets/base.css'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'
import type { User } from '@/stores/auth'
import { useI18n } from 'vue-i18n'
import Wrapper from '@/components/shared/Wrapper.vue'
import Button from '@/components/shared/Button.vue'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav.vue'
import OrderDetailsModal from '@/components/orders/OrderDetailsModal.vue'
import AvatarSelector from '@/components/users/AvatarSelector.vue'
import axios from '@/lib/axios'

const { t, locale } = useI18n()
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

const ordersStore = useOrdersStore()
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
        const productRes = await axios.get(review._links.product.href.replace('http://localhost:8080', ''))
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
const selectedLanguage = ref(locale.value)
const theme = ref('system')
const notifications = ref({ enabled: true })

// Logic for mobile navigation.
const isMobileNavOpen = ref(false)

// Order Details Modal state
const isOrderDetailsModalOpen = ref(false)
const isAvatarSelectorOpen = ref(false)
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

const setTheme = (newTheme: string) => {
  theme.value = newTheme
  // Apply the theme change, for example, by adding or removing a 'dark' class from the root element.
  if (newTheme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
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
  // Set the initial theme based on system preference if the theme is set to 'system'.
  if (theme.value === 'system') {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

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
</style>
