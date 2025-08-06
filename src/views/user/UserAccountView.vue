<template>
  <div class="pt-[85px] lg:pt-0 bg-white dark:bg-gray-900 text-black dark:text-white animate-fadeInUp transition-colors duration-200">
    <!-- Debug Panel - Only shown in development -->
    <DebugPanel
      :show-debug-panel="showDebugPanel"
      :debug-data="{
        username: user?.username,
        theme: themeStore.selectedTheme,
        wishlistCount: wishlistProducts.length,
        ordersCount: orders.length,
        refundsCount: refunds.length,
        addressesCount: addresses.length,
        reviewsCount: reviews.length
      }"
      @toggle="toggleDebugPanel"
    />
    <Wrapper class="py-8">
      <!-- SEO and Accessibility improvements -->
      <div class="sr-only">
        <h1>{{ $t('account.title') }} - User Account Dashboard</h1>
        <p>Manage your profile, orders, wishlist, addresses, reviews, and account settings</p>
      </div>

      <!-- Breadcrumb Navigation -->
      <BreadcrumbNav :breadcrumbs="breadcrumbs" />

      <!-- Page Header -->
      <header class="mx-auto mb-8 max-w-7xl">
        <h1 :class="['text-2xl font-semibold text-left font-srProDisplay', textClasses]">
          {{ $t('account.title') }}
        </h1>
      </header>

      <div class="mx-auto max-w-7xl">
        <div class="flex flex-col gap-8 lg:flex-row">
          <!-- Sidebar Navigation -->
          <aside class="self-start w-full mb-4 lg:w-1/4 lg:mb-0" role="navigation" aria-label="Account sections">
            <AccountNavigation
              :sections="sections"
              :active-section="activeSection"
              :is-mobile-nav-open="isMobileNavOpen"
              :nav-classes="navClasses"
              :text-classes="textClasses"
              :link-classes="linkClasses"
              @toggle-mobile="toggleMobileNav"
              @close-mobile="closeMobileNav"
            />
          </aside>

          <!-- Main Content -->
          <main class="flex-1 space-y-8 lg:ml-0">
            <!-- Profile Section -->
            <ProfileSection
              :section-id="sections[0].id"
              :user="user"
              :editable-user="editableUser"
              :is-edit-profile-open="isEditProfileOpen"
              :section-container-classes="sectionContainerClasses"
              :text-classes="textClasses"
              :section-header-classes="sectionHeaderClasses"
              :button-outline-classes="buttonOutlineClasses"
              :button-text-classes="buttonTextClasses"
              :button-primary-classes="buttonPrimaryClasses"
              :text-secondary-classes="textSecondaryClasses"
              :input-classes="inputClasses"
              @toggle-edit="toggleEditProfile"
              @refresh-profile="refreshProfile"
              @save-profile="saveProfile"
              @cancel-edit="cancelEdit"
              @open-avatar-selector="openAvatarSelector"
              @update-field="updateEditableField"
            />

            <!-- Orders Section -->
            <section
              :id="sections[1].id"
              :class="['transition-colors duration-200', sectionContainerClasses]"
            >
              <div class="flex items-center justify-between mb-6">
                <h2 :class="['text-xl font-semibold font-srProDisplay', textClasses]">
                <span :class="sectionHeaderClasses">{{ $t('account.orders.title') }}</span>
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
                  <v-icon name="hi-clipboard-list" scale="2" :class="['mb-4 opacity-80', emptyStateIconClasses]" aria-hidden="true" />
                  <p :class="['text-base font-srProDisplay', emptyStateTextClasses]">{{ $t('account.orders.emptyMessage') }}</p>
                </div>
                <div v-else>
                  <div
                    v-for="order in orders.slice(0, 5)"
                    :key="order.id"
                    :class="listItemClasses"
                    role="listitem"
                  >
                    <div class="flex items-center gap-4">
                      <div :class="iconContainerClasses">
                        <v-icon name="hi-clipboard-list" scale="1.2" :class="iconInContainerClasses" />
                      </div>
                      <div>
                        <p :class="['font-medium font-srProDisplay', textClasses]">
                          {{ $t('account.orders.order') }} #{{ order.id }}
                        </p>
                        <p :class="['text-sm font-srProDisplay', textSecondaryClasses]">{{ order.date }}</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-4">
                      <span
                        :class="[getStatusColor(order.status), statusBadgeClasses]"
                      >
                        {{ order.status }}
                      </span>
                      <Button
                        @click="openOrderDetailsModal(order)"
                        bg-color="transparent"
                        width="auto"
                        height="auto"
                        :class="['px-4', actionButtonClasses]"
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
              :class="['transition-colors duration-200', sectionContainerClasses]"
            >
              <div class="flex items-center justify-between mb-6">
                <h2 :class="['text-xl font-semibold font-srProDisplay', textClasses]">
                <span :class="sectionHeaderClasses">{{ $t('account.refunds.title') }}</span>
                </h2>
              </div>
              <div v-if="refunds.length === 0" class="py-8 text-center">
                <v-icon name="hi-arrow-left" scale="2" :class="['mb-4 opacity-80', emptyStateIconClasses]" />
                <p :class="['text-base font-srProDisplay', emptyStateTextClasses]">{{ $t('account.refunds.empty') }}</p>
              </div>
              <div v-else class="space-y-4">
                <div
                  v-for="refund in refunds.slice(0, 5)"
                  :key="refund.id"
                  :class="listItemClasses"
                  role="listitem"
                >
                  <div class="flex items-center gap-4">
                    <div :class="['flex items-center justify-center w-10 h-10 rounded-lg', iconContainerClasses]">
                      <v-icon name="hi-arrow-left" scale="1.2" :class="iconInContainerClasses" />
                    </div>
                    <div>
                      <p :class="['font-medium font-srProDisplay', textClasses]">
                        {{ refund.status === 'Returned' ? 'Return' : 'Refund' }} #{{ refund.id }}
                      </p>
                      <p :class="['text-sm font-srProDisplay', textSecondaryClasses]">{{ refund.date }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-4">
                    <span
                      :class="[getRefundStatusColor(refund.status), statusBadgeClasses]"
                    >
                      {{ refund.status }}
                    </span>
                    <Button
                      @click="openOrderDetailsModal(refund)"
                      bg-color="transparent"
                      width="auto"
                      height="auto"
                      :class="['px-4', actionButtonClasses]"
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
              :class="['transition-colors duration-200', sectionContainerClasses]"
              aria-labelledby="wishlist-title"
            >
              <div class="flex items-center justify-between mb-6">
                <h2 id="wishlist-title" :class="['text-xl font-semibold font-srProDisplay', textClasses]">
                  <span :class="sectionHeaderClasses">{{ $t('account.wishlist.title') }}</span>
                </h2>
                <router-link
                  to="/wishlist"
                  :class="['text-sm font-medium transition-colors', linkClasses, 'focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1']"
                  :aria-label="`View all ${wishlistProducts.length} wishlist items`"
                >
                  {{ $t('account.wishlist.viewAll') }}
                </router-link>
              </div>

              <!-- Loading state for wishlist -->
              <div v-if="wishlistLoading" class="flex items-center justify-center py-8" role="status" aria-live="polite">
                <div class="w-8 h-8 border-b-2 border-black rounded-full dark:border-white animate-spin opacity-70" aria-hidden="true"></div>
                <span class="sr-only">Loading wishlist items...</span>
              </div>

              <!-- Error state for wishlist -->
              <div v-else-if="wishlistError" class="p-4 border border-red-200 rounded-lg dark:border-red-800 bg-red-50" role="alert dark:bg-red-900/20">
                <p class="text-sm font-semibold text-red-700 dark:text-red-400">{{ wishlistError }}</p>
              </div>

              <!-- Empty state when no wishlist items are available -->
              <div v-else-if="wishlistProducts.length === 0" class="py-8 text-center">
                <v-icon name="hi-heart" scale="2" :class="['mb-4 opacity-80', emptyStateIconClasses]" aria-hidden="true" />
                <p :class="['text-base font-srProDisplay', emptyStateTextClasses]">{{ $t('account.wishlist.emptyMessage') }}</p>
              </div>

              <!-- Display grid of wishlist items -->
              <div
                v-else
                class="grid grid-cols-1 gap-4 md:grid-cols-2"
                role="list"
                :aria-label="`${wishlistProducts.length} wishlist items`"
              >
                <div
                  v-for="item in wishlistProducts.slice(0, 6)"
                  :key="item.id"
                  :class="['flex items-center gap-4 transition-all duration-200 group', listItemClasses]"
                  role="listitem"
                >
                  <div class="relative">
                    <router-link
                      :to="`/products/${item.id}`"
                      class="block rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      :aria-label="`View ${item.name} details`"
                    >
                      <img
                        :src="item.imageUrl"
                        :alt="item.name"
                        class="object-contain w-16 h-16 p-2 transition-transform rounded-lg hover:scale-105"
                        loading="lazy"
                        width="64"
                        height="64"
                        :onerror="`this.src='https://res.cloudinary.com/tejon-tech/image/upload/v1752495175/logo_egh7pf.webp'`"
                      />
                    </router-link>
                    <button
                      @click="removeFromWishlist(item.id, item.name)"
                      :disabled="removeItemLoading[item.id]"
                      class="absolute flex items-center justify-center w-6 h-6 transition-opacity bg-red-500 rounded-full opacity-0 cursor-pointer -top-2 -right-2 group-hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-300 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      :aria-label="`Remove ${item.name} from wishlist`"
                      type="button"
                    >
                      <div v-if="removeItemLoading[item.id]" class="w-3 h-3 border border-white rounded-full border-t-transparent animate-spin" aria-hidden="true"></div>
                      <v-icon v-else name="hi-x" scale="0.8" class="text-white" aria-hidden="true" />
                    </button>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 :class="['mb-1 text-sm font-medium font-srProDisplay line-clamp-2', textClasses]">
                      {{ item.name }}
                    </h4>
                    <p :class="['text-lg font-semibold font-srProDisplay', priceTextClasses]">
                      ${{ item.basePrice.toFixed(2) }}
                    </p>
                  </div>
                  <Button
                    @click="addToCartFromWishlist(item.id, item.name)"
                    :disabled="cartItemLoading[item.id] || addedToCartItems[item.id]"
                    :text-color="addedToCartItems[item.id] ? '#16a34a' : 'white'"
                    :bg-color="addedToCartItems[item.id] ? '#f0fdf4' : 'black'"
                    :hover-bg-color="addedToCartItems[item.id] ? '#dcfce7' : '#333333'"
                    :border-width="addedToCartItems[item.id] ? '1px' : '0'"
                    :border-color="addedToCartItems[item.id] ? '#16a34a' : 'transparent'"
                    width="auto"
                    height="32px"
                    class="px-3 text-sm transition-all duration-300 shrink-0"
                    :aria-label="addedToCartItems[item.id] ? `${item.name} is in cart` : `Add ${item.name} to cart`"
                  >
                    <span v-if="cartItemLoading[item.id]" class="flex items-center gap-2">
                      <div class="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin" aria-hidden="true"></div>
                      <span class="sr-only">Adding to cart...</span>
                      Adding...
                    </span>
                    <span v-else-if="addedToCartItems[item.id]" class="flex items-center gap-2">
                      <v-icon name="hi-check" scale="0.9" class="text-green-600" aria-hidden="true" />
                      Added to Cart
                    </span>
                    <span v-else>
                      {{ $t('account.wishlist.addToCart') }}
                    </span>
                  </Button>
                </div>
              </div>
            </section>

            <!-- Addresses Section -->
            <section
              :id="sections[4].id"
              :class="['transition-colors duration-200', sectionContainerClasses]"
            >
              <div class="flex items-center justify-between mb-6">
                <h2 :class="['text-xl font-semibold font-srProDisplay', textClasses]">
                <span :class="sectionHeaderClasses">{{ $t('account.addresses.title') }}</span>
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
                <span :class="['ml-3 font-medium', loadingTextClasses]">Loading addresses...</span>
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
                <v-icon name="hi-location-marker" scale="2" :class="['mb-3 opacity-80', emptyStateIconClasses]" />
                <p :class="['mb-4 text-base font-srProDisplay', emptyStateTextClasses]">You have no saved addresses</p>
                <Button
                  :class="['px-4 font-semibold transition-colors duration-200', buttonPrimaryClasses]"
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
                  :class="['transition-all duration-200 group', listItemClasses]"
                >
                  <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center gap-2">
                      <v-icon name="hi-location-marker" scale="1.1" :class="iconColorClasses" />
                      <!-- Address Name -->
                      <h4 :class="['font-semibold font-srProDisplay', textClasses]">
                        {{ address.name }}
                      </h4>
                    </div>
                    <div class="flex gap-1 transition-opacity opacity-0 group-hover:opacity-100">
                      <button
                        :class="['p-1 transition-colors rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-300 hover:bg-gray-100 dark:hover:bg-gray-700', interactiveIconClasses]"
                        aria-label="Editar dirección"
                        tabindex="0"
                      >
                        <v-icon name="hi-pencil" scale="0.9" />
                      </button>
                      <button
                        :class="['p-1 transition-colors rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400', interactiveIconClasses]"
                        aria-label="Eliminar dirección"
                        tabindex="0"
                      >
                        <v-icon name="hi-trash" scale="0.9" />
                      </button>
                    </div>
                  </div>

                  <!-- Display all address fields from the API -->
                  <p :class="['text-sm leading-relaxed font-srProDisplay', textSecondaryClasses]">
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
              :class="['transition-colors duration-200', sectionContainerClasses]"
            >
              <div class="flex items-center justify-between mb-6">
                <h2 :class="['text-xl font-semibold font-srProDisplay', textClasses]">
                <span :class="sectionHeaderClasses">{{ $t('account.reviews.title') }}</span>
                </h2>
                <span :class="['text-sm font-medium', textSecondaryClasses]"
                  >{{ reviews.length }} {{ $t('account.reviews.reviews') }}</span
                >
              </div>
              <div class="space-y-4">
                <div v-if="reviewsLoading" :class="['py-4 text-center', loadingTextClasses]">
                  <span class="font-medium opacity-80">Loading reviews...</span>
                </div>
                <div v-else-if="reviewsError" class="p-4 text-red-700 border border-red-200 rounded-lg dark:text-red-400 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
                  <span class="font-semibold">{{ reviewsError }}</span>
                </div>
                <div v-else-if="reviews.length === 0" class="py-8 text-center">
                  <v-icon name="hi-annotation" scale="2" :class="['mb-4 opacity-80', emptyStateIconClasses]" />
                  <p :class="['text-base font-srProDisplay', emptyStateTextClasses]">{{ $t('account.reviews.empty') }}</p>
                </div>
                <div v-else class="max-h-[400px] overflow-y-auto custom-scrollbar pr-2 space-y-4">
                  <div
                    v-for="review in reviews"
                    :key="review.id"
                    :class="reviewCardClasses"
                  >
                    <div class="flex items-start justify-between mb-3">
                      <div>
                        <span :class="reviewHeaderClasses">{{ review.product }}</span>
                        <span class="ml-2 text-yellow-500 dark:text-yellow-400">{{ '★'.repeat(review.rating) }}</span>
                      </div>
                      <span :class="reviewMetaClasses">{{ review.date }}</span>
                    </div>
                    <p :class="['text-sm font-srProDisplay', reviewBodyClasses]">
                      {{ review.comment }}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Settings Section -->
            <section
              :id="sections[6].id"
              :class="['transition-colors duration-200', sectionContainerClasses]"
            >
              <h2 :class="['mb-6 text-xl font-semibold font-srProDisplay', textClasses]">
                <span :class="sectionHeaderClasses">{{ $t('account.settings.title') }}</span>
              </h2>
              <div class="space-y-6">
                <!-- Language Setting -->
                <div :class="reviewContentClasses">
                  <div class="flex items-center justify-between p-4">
                    <div class="flex items-center gap-3">
                      <div :class="['flex items-center justify-center w-10 h-10 rounded-lg', iconContainerClasses]">
                        <v-icon name="hi-globe" scale="1.2" :class="iconInContainerClasses" />
                      </div>
                      <div>
                        <h4 :class="['font-medium font-srProDisplay', textClasses]">
                          {{ $t('account.settings.language.title') }}
                        </h4>
                        <p :class="['text-sm font-srProDisplay', textSecondaryClasses]">
                          {{ $t('account.settings.language.description') }}
                        </p>
                      </div>
                    </div>
                    <select
                      :value="currentLocale.code"
                      @change="handleLanguageChange(($event.target as HTMLSelectElement).value)"
                      class="px-3 py-2 text-sm text-black placeholder-gray-400 transition-all duration-200 bg-white border border-gray-300 rounded-lg cursor-pointer dark:placeholder-gray-500 dark:border-gray-600 font-srProDisplay dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 focus:border-blue-600 dark:focus:border-blue-400 focus:shadow-lg"
                    >
                      <option v-for="locale in availableLocales" :key="locale.code" :value="locale.code">
                        {{ locale.name }}
                      </option>
                    </select>
                  </div>
                </div>

                <!-- App Theme Setting -->
                <div :class="reviewContentClasses">
                  <div class="flex items-center justify-between p-4">
                    <div class="flex items-center gap-3">
                      <div :class="['flex items-center justify-center w-10 h-10 rounded-lg', iconContainerClasses]">
                        <v-icon name="hi-color-swatch" scale="1.2" :class="iconInContainerClasses" />
                      </div>
                      <div>
                        <h4 :class="['font-medium font-srProDisplay', textClasses]">
                          {{ $t('account.settings.theme.title') }}
                        </h4>
                        <p :class="['text-sm font-srProDisplay', textSecondaryClasses]">
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
                </div>

                <!-- Security Setting -->
                <div :class="reviewContentClasses">
                  <div class="flex items-center justify-between p-4">
                    <div class="flex items-center gap-3">
                      <div :class="['flex items-center justify-center w-10 h-10 rounded-lg', iconContainerClasses]">
                        <v-icon name="hi-key" scale="1.2" :class="iconInContainerClasses" />
                      </div>
                      <div>
                        <h4 :class="['font-medium font-srProDisplay', textClasses]">
                          {{ $t('account.settings.security.title') }}
                        </h4>
                        <p :class="['text-sm font-srProDisplay', textSecondaryClasses]">
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
import '@/assets/base.css'
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'
import type { User } from '@/stores/auth'
import { useI18n } from 'vue-i18n'
import { useLanguage } from '@/composables/useLanguage'
import { useToast } from '@/composables/useToast'
import { useThemeClasses } from '@/composables/useThemeClasses'
import Wrapper from '@/components/shared/Wrapper.vue'
import Button from '@/components/shared/Button.vue'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav.vue'

// Lazy load heavy components for better performance
import { defineAsyncComponent } from 'vue'
const OrderDetailsModal = defineAsyncComponent(() => import('@/components/orders/OrderDetailsModal.vue'))
const AvatarSelector = defineAsyncComponent(() => import('@/components/users/AvatarSelector.vue'))
const ChangePasswordModal = defineAsyncComponent(() => import('@/components/users/ChangePasswordModal.vue'))

// Import new refactored components
import DebugPanel from '@/components/user/DebugPanel.vue'
import AccountNavigation from '@/components/user/AccountNavigation.vue'
import ProfileSection from '@/components/user/ProfileSection.vue'

import axios from '@/lib/axios'

// Performance optimizations
const showDebug = ref(import.meta.env.DEV) // Debug toggle state - show by default in dev mode
const showDebugPanel = computed(() => import.meta.env.DEV && showDebug.value) // Only show in dev mode

// Language composable for global language sync
const { currentLocale, availableLocales, changeLanguage } = useLanguage()

// Toast notifications
const toast = useToast()

// Theme classes composable for consistent styling
const {
  textClasses,
  navClasses,
  buttonPrimaryClasses,
  buttonOutlineClasses,
  buttonTextClasses,
  inputClasses,
  linkClasses,
  themeButtonBaseClasses,
  themeButtonActiveClasses,
  themeButtonInactiveClasses,
  reviewCardClasses,
  reviewContentClasses,
  reviewHeaderClasses,
  reviewBodyClasses,
  reviewMetaClasses,
  sectionContainerClasses,
  sectionHeaderClasses,
  listItemClasses,
  statusBadgeClasses,
  actionButtonClasses,
  iconContainerClasses,
  iconInContainerClasses,
  emptyStateTextClasses,
  emptyStateIconClasses,
  loadingTextClasses,
  iconColorClasses,
  interactiveIconClasses,
  priceTextClasses,
  textSecondaryClasses
} = useThemeClasses()

const { t } = useI18n()
const authStore = useAuthStore()
const usersStore = useUsersStore()

// Memoized breadcrumbs
const breadcrumbs = computed(() => [
  { label: t('breadcrumbs.home'), to: '/' },
  { label: t('breadcrumbs.account'), to: '/account' },
])

// Memoized sections with performance optimization
const sections = computed(() => [
  { id: 'profile', label: t('account.profile.title'), icon: 'fa-user-circle' },
  { id: 'orders', label: t('account.orders.title'), icon: 'hi-clipboard-list' },
  { id: 'refunds', label: t('account.refunds.title'), icon: 'hi-arrow-left' },
  { id: 'wishlist', label: t('account.wishlist.title'), icon: 'hi-heart' },
  { id: 'addresses', label: t('account.addresses.title'), icon: 'hi-location-marker' },
  { id: 'reviews', label: t('account.reviews.title'), icon: 'bi-star-fill' },
  { id: 'settings', label: t('account.settings.title'), icon: 'hi-adjustments' },
])

// User state with performance optimization
const user = computed(() => (authStore.user ?? {}) as User)

// Orders state - lazy loaded imports for better performance
import { useOrdersStore } from '@/stores/orders'
import { useWishlistStore } from '@/stores/wishlist'
import { useUserCartStore } from '@/stores/userCart'
import { useProductVariantsStore } from '@/stores/productVariants'
import { useThemeStore } from '@/stores/theme'

const ordersStore = useOrdersStore()
const themeStore = useThemeStore()
const { wishlistProducts, wishlistLoading, wishlistError, fetchUserWishlist } = useWishlistStore()
const userCartStore = useUserCartStore()
const productVariantsStore = useProductVariantsStore()

// Reactive reference to orders from the store (excluding RETURNED and REFUNDED orders)
const orders = computed(() =>
  ordersStore.orders
    .filter(order => order.status !== 'RETURNED' && order.status !== 'REFUNDED')
    .map(order => {
      // Format the status for display
      const displayStatus = order.status === 'CREATED' ? 'Created' :
                           order.status === 'PAID' ? 'Paid' :
                           order.status === 'SHIPPED' ? 'Shipped' :
                           order.status === 'DELIVERED' ? 'Delivered' :
                           order.status === 'CANCELED' ? 'Cancelled' :
                           order.status

      // Calculate expected delivery (7 days from order date)
      const orderDate = new Date(order.orderDate)
      const expectedDelivery = new Date(orderDate.getTime() + (7 * 24 * 60 * 60 * 1000))

      return {
        id: order.id.toString(),
        date: new Date(order.orderDate).toISOString().split('T')[0],
        status: displayStatus,
        expectedDelivery: expectedDelivery.toISOString().split('T')[0],
        items: order.orderItems?.map(item => ({
          id: item.id,
          name: item.product?.name || 'Product',
          description: item.product?.description || '',
          image: 'https://res.cloudinary.com/tejon-tech/image/upload/v1752495175/logo_egh7pf.webp', // Placeholder; will be loaded in detail view
          price: item.unitPrice,
          quantity: item.quantity,
        })) || [],
        subtotal: order.orderItems?.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0) || order.totalAmount,
        shipping: 0, // Will be calculated in detail view if needed
        tax: 0, // Will be calculated in detail view if needed
        discount: order.hasDiscount ? (order.totalAmount * 0.1) : 0, // Assuming 10% if hasDiscount is true
        total: order.totalAmount,
        shippingAddress: {
          name: user.value?.username || 'N/A',
          street: 'Will be loaded...',
          city: 'N/A',
          state: 'N/A',
          zipCode: 'N/A',
          country: 'N/A'
        },
        billingAddress: {
          name: user.value?.username || 'N/A',
          street: 'Will be loaded...',
          city: 'N/A',
          state: 'N/A',
          zipCode: 'N/A',
          country: 'N/A'
        },
        paymentMethod: {
          type: order.payment?.paymentMethod || 'Credit Card',
          lastFour: '****'
        },
        paymentStatus: order.payment?.paymentStatus || (order.status === 'PAID' || order.status === 'SHIPPED' || order.status === 'DELIVERED' ? 'Paid' : 'Pending'),
        trackingNumber: `TN${order.id}`,
        carrier: 'Standard Shipping'
      }
    })
)

// Refunds state - computed from orders with RETURNED and REFUNDED status
const refunds = computed(() =>
  ordersStore.returnsAndRefunds.map(order => {
    // Calculate expected delivery (7 days from order date)
    const orderDate = new Date(order.orderDate)
    const expectedDelivery = new Date(orderDate.getTime() + (7 * 24 * 60 * 60 * 1000))

    return {
      id: order.id.toString(),
      date: new Date(order.orderDate).toISOString().split('T')[0],
      status: order.status === 'RETURNED' ? 'Returned' : 'Refunded',
      expectedDelivery: expectedDelivery.toISOString().split('T')[0],
      items: order.orderItems?.map(item => ({
        id: item.id,
        name: item.product?.name || 'Product',
        description: item.product?.description || '',
        image: 'https://res.cloudinary.com/tejon-tech/image/upload/v1752495175/logo_egh7pf.webp',
        price: item.unitPrice,
        quantity: item.quantity,
      })) || [],
      subtotal: order.orderItems?.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0) || order.totalAmount,
      shipping: 0,
      tax: 0,
      discount: order.hasDiscount ? (order.totalAmount * 0.1) : 0,
      total: order.totalAmount,
      shippingAddress: {
        name: user.value?.username || 'N/A',
        street: 'Will be loaded...',
        city: 'N/A',
        state: 'N/A',
        zipCode: 'N/A',
        country: 'N/A'
      },
      billingAddress: {
        name: user.value?.username || 'N/A',
        street: 'Will be loaded...',
        city: 'N/A',
        state: 'N/A',
        zipCode: 'N/A',
        country: 'N/A'
      },
      paymentMethod: {
        type: order.payment?.paymentMethod || 'Credit Card',
        lastFour: '****'
      },
      paymentStatus: order.payment?.paymentStatus || 'Refunded',
      trackingNumber: `TN${order.id}`,
      carrier: 'Standard Shipping'
    }
  })
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
    toast.error('Failed to load your reviews', {
      title: 'Loading Error',
      duration: 4000
    })
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

const updateEditableField = (field: string, value: string) => {
  switch (field) {
    case 'name':
      editableUser.value.name = value
      break
    case 'location':
      editableUser.value.location = value
      break
    case 'avatar':
      editableUser.value.avatar = value
      break
    default:
      console.warn(`Unknown field: ${field}`)
  }
}

const saveProfile = async () => {
  try {
    // Save changes using the store
    if (authStore.user) {
      const result = await authStore.updateUserProfile({
        username: editableUser.value.name,
        avatar: editableUser.value.avatar,
        location: editableUser.value.location,
      })

      if (result.success) {
        toast.success('Profile updated successfully!', {
          title: 'Profile Saved',
          duration: 3000
        })
        isEditProfileOpen.value = false
      } else {
        toast.error(result.error || 'Failed to update profile', {
          title: 'Update Failed',
          duration: 4000
        })
      }
    }
  } catch (error) {
    console.error('Error updating profile:', error)
    toast.error('An unexpected error occurred while updating your profile', {
      title: 'Update Error',
      duration: 4000
    })
  }
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

// Language change wrapper with toast
const handleLanguageChange = (newLocale: string) => {
  changeLanguage(newLocale)
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

// Backend API interfaces
interface BackendOrderItem {
  id: number
  quantity: number
  unitPrice: number
  _links: {
    self: { href: string }
    orderItem: { href: string }
    order: { href: string }
    productVariant: { href: string }
  }
}

const openOrderDetailsModal = async (order: OrderType) => {
  try {
    // Show loading state while fetching detailed order data
    const loadingOrder: OrderType = {
      ...order,
      items: [],
      shippingAddress: {
        name: 'Loading...',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
      billingAddress: {
        name: 'Loading...',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      }
    }
    selectedOrder.value = loadingOrder
    isOrderDetailsModalOpen.value = true
    document.body.style.overflow = 'hidden'

    // Fetch detailed order information
    const detailedOrder = await fetchDetailedOrderInfo(parseInt(order.id))
    selectedOrder.value = detailedOrder
  } catch (error) {
    console.error('Error fetching order details:', error)
    toast.error('Failed to load order details', {
      title: 'Loading Error',
      duration: 4000
    })
    closeOrderDetailsModal()
  }
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
  toast.success('Password changed successfully!', {
    title: 'Security Update',
    duration: 3000
  })
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

        // Show success toast
        toast.success('Profile picture updated successfully!', {
          title: 'Avatar Saved',
          duration: 3000
        })
      } else {
        console.error('Failed to update avatar:', result.error)
        toast.error(result.error || 'Failed to update profile picture', {
          title: 'Update Failed',
          duration: 4000
        })
      }
    }
  } catch (error) {
    console.error('Error saving avatar:', error)
    toast.error('An unexpected error occurred while updating your profile picture', {
      title: 'Update Error',
      duration: 4000
    })
  }
}

// Fetch detailed order information from backend
const fetchDetailedOrderInfo = async (orderId: number): Promise<OrderType> => {
  try {
    // 1. Fetch basic order info
    const orderResponse = await axios.get(`/orders/${orderId}`)
    const orderData = orderResponse.data

    // 2. Fetch order items
    const orderItemsResponse = await axios.get(`/orders/${orderId}/orderItems`)
    const orderItems = orderItemsResponse.data._embedded?.orderItems || []

    // 3. Fetch shipping address
    const shippingAddressResponse = await axios.get(`/orders/${orderId}/shippingAddress`)
    const shippingAddressData = shippingAddressResponse.data

    // 4. Fetch detailed product information for each order item
    const detailedItems: OrderItem[] = await Promise.all(
      orderItems.map(async (item: BackendOrderItem) => {
        try {
          // Fetch product variant details
          const variantResponse = await axios.get(item._links.productVariant.href)
          const variantData = variantResponse.data

          // Fetch product details
          const productResponse = await axios.get(variantData._links.product.href)
          const productData = productResponse.data

          return {
            id: item.id,
            name: productData.name,
            description: productData.description || '',
            image: productData.imageUrl || 'https://res.cloudinary.com/tejon-tech/image/upload/v1752495175/logo_egh7pf.webp',
            price: item.unitPrice,
            quantity: item.quantity,
          }
        } catch (error) {
          console.error(`Error fetching product details for item ${item.id}:`, error)
          return {
            id: item.id,
            name: 'Unknown Product',
            description: '',
            image: 'https://res.cloudinary.com/tejon-tech/image/upload/v1752495175/logo_egh7pf.webp',
            price: item.unitPrice,
            quantity: item.quantity,
          }
        }
      })
    )

    // 5. Calculate totals
    const subtotal = detailedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const shipping = 0 // You can enhance this if shipping cost is available
    const tax = 0 // You can enhance this if tax is available
    const discount = orderData.hasDiscount ? (subtotal * 0.1) : 0 // Assuming 10% discount if hasDiscount is true
    const total = orderData.totalAmount

    // 6. Determine expected delivery date
    const orderDate = new Date(orderData.orderDate)
    const expectedDelivery = new Date(orderDate.getTime() + (7 * 24 * 60 * 60 * 1000)) // 7 days from order date

    // 7. Build the complete order object
    const detailedOrder: OrderType = {
      id: orderId.toString(),
      date: new Date(orderData.orderDate).toISOString().split('T')[0],
      status: orderData.status === 'CREATED' ? 'Created' :
              orderData.status === 'PAID' ? 'Paid' :
              orderData.status === 'SHIPPED' ? 'Shipped' :
              orderData.status === 'DELIVERED' ? 'Delivered' :
              orderData.status === 'CANCELED' ? 'Cancelled' :
              orderData.status,
      expectedDelivery: expectedDelivery.toISOString().split('T')[0],
      items: detailedItems,
      subtotal,
      shipping,
      tax,
      discount,
      total,
      shippingAddress: {
        name: shippingAddressData.user?.displayName || shippingAddressData.user?.username || 'N/A',
        street: shippingAddressData.street || 'N/A',
        city: shippingAddressData.city || 'N/A',
        state: shippingAddressData.state || 'N/A',
        zipCode: shippingAddressData.zipCode || 'N/A',
        country: shippingAddressData.country || 'N/A'
      },
      billingAddress: {
        // Using shipping address as billing address for now
        name: shippingAddressData.user?.displayName || shippingAddressData.user?.username || 'N/A',
        street: shippingAddressData.street || 'N/A',
        city: shippingAddressData.city || 'N/A',
        state: shippingAddressData.state || 'N/A',
        zipCode: shippingAddressData.zipCode || 'N/A',
        country: shippingAddressData.country || 'N/A'
      },
      paymentMethod: {
        type: 'Credit Card', // Default for now, you can enhance this
        lastFour: '****' // You can enhance this when payment details are available
      },
      paymentStatus: orderData.status === 'PAID' || orderData.status === 'SHIPPED' || orderData.status === 'DELIVERED' ? 'Paid' : 'Pending',
      trackingNumber: `TN${orderId}`,
      carrier: 'Standard Shipping'
    }

    return detailedOrder
  } catch (error) {
    console.error('Error fetching detailed order info:', error)
    throw new Error('Failed to fetch order details')
  }
}

// Debug panel toggle function
const toggleDebugPanel = () => {
  showDebug.value = !showDebug.value
  console.log(`🛠️ Debug panel ${showDebug.value ? 'enabled' : 'disabled'}`)
}

// Keyboard shortcut handler for debug panel
const handleDebugKeyboard = (event: KeyboardEvent) => {
  if ((event.ctrlKey || event.metaKey) && event.key === 'd' && import.meta.env.DEV) {
    event.preventDefault()
    toggleDebugPanel()
  }
}

onMounted(async () => {
  // Theme initialization is now handled by the store in main.ts

  // Add keyboard shortcut for debug panel (Ctrl+D or Cmd+D)
  if (import.meta.env.DEV) {
    document.addEventListener('keydown', handleDebugKeyboard)
  }

  // Performance optimization: Load critical data first, then lazy load other sections
  if (authStore.isAuthenticated && authStore.user?.id) {
    try {
      // Priority 1: Load user profile data first (most important)
      await authStore.fetchCurrentUser()

      // Priority 2: Load user details and addresses
      const userPromise = usersStore.fetchUserById(authStore.user.id)

      // Wait for user data before loading addresses
      await userPromise

      // Priority 3: Load secondary data in parallel with lower priority
      const secondaryDataPromises = []

      if (usersStore.selectedUser) {
        secondaryDataPromises.push(usersStore.fetchUserAddresses(usersStore.selectedUser))
      }

      // Lazy load orders, wishlist, and reviews with staggered timing to reduce initial load
      setTimeout(() => {
        if (authStore.user?.id) {
          ordersStore.fetchOrdersByUser(authStore.user.id)
        }
      }, 500)

      setTimeout(() => {
        if (authStore.user?.id) {
          fetchUserWishlist(authStore.user.id)
        }
      }, 1000)

      setTimeout(() => {
        if (authStore.user?.id) {
          fetchUserReviews(authStore.user.id)
        }
      }, 1500)

      // Initialize cart after other critical operations
      setTimeout(async () => {
        if (authStore.user?.id) {
          console.log('🟣 [USER ACCOUNT] Initializing cart for user:', authStore.user.id)
          await userCartStore.fetchUserCart(authStore.user.id)
          checkWishlistProductsInCart()
        }
      }, 2000)

      // Wait for secondary data
      await Promise.allSettled(secondaryDataPromises)

    } catch (error) {
      console.error('Error loading account data:', error)
      toast.error('Some account data could not be loaded', {
        title: 'Loading Error',
        duration: 4000
      })
    }
  }

  // Set up intersection observer for navigation (low priority)
  setTimeout(() => {
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
  }, 100)
})

// Watch for changes in wishlist and re-check cart status
watch(() => wishlistProducts.value, () => {
  checkWishlistProductsInCart()
}, { deep: true })

// Clean up side effects when the component is unmounted.
onUnmounted(() => {
  document.body.classList.remove('nav-open')
  // Restore body scrolling in case modal was open
  document.body.style.overflow = 'auto'

  // Remove keyboard event listener for debug panel
  if (import.meta.env.DEV) {
    document.removeEventListener('keydown', handleDebugKeyboard)
  }
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

    toast.success('Profile data refreshed!', {
      duration: 2500
    })
  } catch (error) {
    console.error('Error al refrescar perfil:', error)
    toast.error('Failed to refresh profile data', {
      title: 'Refresh Failed',
      duration: 4000
    })
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

    toast.success('Addresses refreshed!', {
      duration: 2500
    })
  } catch (error) {
    console.error('Error al refrescar direcciones:', error)
    toast.error('Failed to refresh addresses', {
      title: 'Refresh Failed',
      duration: 4000
    })
  }
}

// ===========================
// 🛒 Cart Functionality
// ===========================

// Loading states for cart operations
const cartItemLoading = ref<{ [key: number]: boolean }>({})
const removeItemLoading = ref<{ [key: number]: boolean }>({})
const addedToCartItems = ref<{ [key: number]: boolean }>({})

/**
 * Check which wishlist products are already in the user's cart
 * and mark them as "Added to Cart" to maintain state across page refreshes
 */
const checkWishlistProductsInCart = async () => {
  if (!userCartStore.cart || !wishlistProducts.value.length) {
    return
  }

  try {
    // Get all product IDs from cart items
    const cartProductIds = new Set<number>()

    for (const cartItem of userCartStore.cart.cartItems || []) {
      if (cartItem.productVariant?._links?.product?.href) {
        // Extract product ID from the product link
        const productUrl = cartItem.productVariant._links.product.href
        const productId = parseInt(productUrl.split('/').pop() || '0')
        if (productId) {
          cartProductIds.add(productId)
        }
      }
    }

    // Mark wishlist products that are in cart as "added"
    wishlistProducts.value.forEach(wishlistProduct => {
      if (cartProductIds.has(wishlistProduct.id)) {
        addedToCartItems.value[wishlistProduct.id] = true
      }
    })

    console.log('🟣 [USER ACCOUNT] Cart check complete. Products in cart:', Array.from(cartProductIds))
  } catch (error) {
    console.error('🔴 [USER ACCOUNT] Error checking cart products:', error)
  }
}

const addToCartFromWishlist = async (productId: number, productName: string) => {
  console.log('🟡 [USER ACCOUNT] Add to Cart clicked for product:', productId)

  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    toast.error('Please log in to add products to your cart', {
      title: 'Authentication Required',
      duration: 4000
    })
    return
  }

  // Set loading state for this specific product
  cartItemLoading.value[productId] = true

  try {
    // Step 1: Fetch product variants to get a valid productVariantId
    await productVariantsStore.fetchVariantsByProduct(productId)

    if (productVariantsStore.variants.length === 0) {
      toast.error('This product has no available variants. Please contact support.', {
        title: 'Product Not Available',
        duration: 4000
      })
      return
    }

    // Step 2: Use the first available variant or find one with stock
    const availableVariant = productVariantsStore.variants.find(variant => variant.stock > 0) || productVariantsStore.variants[0]

    if (!availableVariant) {
      toast.error('This product is currently out of stock', {
        title: 'Out of Stock',
        duration: 4000
      })
      return
    }

    // Step 3: Ensure cart is loaded
    if (!userCartStore.cart && authStore.user?.id) {
      console.log('🟡 [USER ACCOUNT] Loading user cart first...')
      await userCartStore.fetchUserCart(authStore.user.id)
    }

    // Step 4: Add product to cart using the variant ID
    const result = await userCartStore.addProductToCart(availableVariant.id)

    if (result.success) {
      console.log('🟢 [USER ACCOUNT] Product added to cart successfully')

      // Mark product as added to cart (permanent until page refresh)
      addedToCartItems.value[productId] = true

      // Refresh cart state to ensure consistency
      setTimeout(() => {
        checkWishlistProductsInCart()
      }, 500)

      toast.success(`${productName} added to your cart!`, {
        title: 'Added to Cart',
        duration: 3000
      })
    } else {
      console.error('🔴 [USER ACCOUNT] Failed to add to cart:', result.error)
      toast.error(result.error || 'Failed to add product to cart', {
        title: 'Cart Error',
        duration: 4000
      })
    }
  } catch (error) {
    console.error('🔴 [USER ACCOUNT] Error adding to cart:', error)
    toast.error('An unexpected error occurred while adding to cart', {
      title: 'Cart Error',
      duration: 4000
    })
  } finally {
    cartItemLoading.value[productId] = false
  }
}

const removeFromWishlist = async (productId: number, productName: string) => {
  console.log('🟡 [USER ACCOUNT] Remove from Wishlist clicked for product:', productId)

  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    toast.error('Please log in to manage your wishlist', {
      title: 'Authentication Required',
      duration: 4000
    })
    return
  }

  // Set loading state for this specific product
  removeItemLoading.value[productId] = true

  try {
    // For now, we'll just remove from the local array since the backend method isn't available
    // In a real implementation, you'd call an API to remove the item from the wishlist

    // Remove from local wishlist array
    const index = wishlistProducts.value.findIndex(item => item.id === productId)
    if (index > -1) {
      wishlistProducts.value.splice(index, 1)
      toast.success(`${productName} removed from your wishlist`, {
        title: 'Removed from Wishlist',
        duration: 3000
      })
    } else {
      toast.error('Product not found in wishlist', {
        title: 'Remove Failed',
        duration: 4000
      })
    }
  } catch (error) {
    console.error('🔴 [USER ACCOUNT] Error removing from wishlist:', error)
    toast.error('An unexpected error occurred while removing from wishlist', {
      title: 'Wishlist Error',
      duration: 4000
    })
  } finally {
    removeItemLoading.value[productId] = false
  }
}
</script>

<style scoped>
/* Optimized transitions for better performance */
.fade-debug-enter-active, .fade-debug-leave-active {
  transition: opacity 0.15s ease-out;
}
.fade-debug-enter-from, .fade-debug-leave-to {
  opacity: 0;
}

/* Optimized scrollbar styles with hardware acceleration */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #d1d5db #f3f4f6;
  transform: translateZ(0); /* Hardware acceleration */
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 6px;
}

/* Hardware acceleration for animations */
.animate-spin {
  transform: translateZ(0);
}

/* Optimize transitions for performance */
.transition-all {
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Performance optimization for hover effects */
.group:hover .group-hover\:opacity-100 {
  will-change: opacity;
}

/* Prevent layout shifts with explicit dimensions */
.w-16.h-16 img {
  min-height: 4rem;
  min-width: 4rem;
}

/* Optimize focus states for accessibility */
.focus\:ring-2:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}
</style>
