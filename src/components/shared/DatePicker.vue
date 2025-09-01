<template>
  <div class="relative" ref="datePickerRef">
    <button @click="toggleCalendar" :class="[
      'w-full px-4 py-3 border border-border rounded-lg bg-background font-srProDisplay text-foreground transition-all duration-200',
      'hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
      'flex items-center justify-between group',
      isOpen ? 'border-primary ring-2 ring-primary/20' : '',
    ]">
      <span :class="selectedDate ? 'text-foreground' : 'text-muted-foreground'">
        {{ selectedDate || 'Select your delivery date' }}
      </span>
      <v-icon name="bi-calendar-event" scale="1.1"
        :class="['transition-all duration-200 group-hover:text-primary', isOpen ? 'text-primary rotate-3' : 'text-muted-foreground']" />
    </button>

    <!-- Modal Overlay -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="isOpen"
          class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
          @click="closeCalendar">
          <!-- Modal Content -->
          <div ref="calendarRef"
            class="w-full max-w-md mx-auto overflow-hidden border shadow-2xl bg-background border-border rounded-2xl calendar-modal"
            @click.stop>
            <!-- Modal Header -->
            <div class="px-6 py-4 border-b border-border/50">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-semibold font-srProDisplay text-foreground">Select Delivery Date</h3>
                  <p class="text-sm text-muted-foreground mt-0.5">Choose when you'd like to receive your order</p>
                </div>
                <button @click="closeCalendar"
                  class="flex items-center justify-center w-8 h-8 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <v-icon name="md-close" scale="1.1" class="text-muted-foreground" />
                </button>
              </div>
            </div>

            <!-- Calendar Navigation -->
            <div class="flex items-center justify-between p-6 pb-4">
              <button @click="previousMonth" :disabled="!canGoToPreviousMonth" :class="[
                'w-10 h-10 rounded-xl transition-all duration-200 flex items-center justify-center',
                canGoToPreviousMonth
                  ? 'hover:bg-primary/10 text-foreground hover:text-primary hover:scale-105'
                  : 'text-gray-300 cursor-not-allowed opacity-50'
              ]">
                <v-icon name="md-chevronleft" scale="1.3" />
              </button>

              <div class="text-center">
                <h4 class="text-xl font-bold font-srProDisplay text-foreground">
                  {{ monthNames[currentMonth] }}
                </h4>
                <p class="text-sm font-medium text-muted-foreground">{{ currentYear }}</p>
              </div>

              <button @click="nextMonth"
                class="flex items-center justify-center w-10 h-10 transition-all duration-200 rounded-xl hover:bg-primary/10 text-foreground hover:text-primary hover:scale-105">
                <v-icon name="md-chevronright" scale="1.3" />
              </button>
            </div>

            <!-- Calendar Grid -->
            <div class="px-6 pb-6">
              <!-- Days of week header -->
              <div class="grid grid-cols-7 gap-1 mb-4">
                <div v-for="day in dayNames" :key="day"
                  class="py-3 text-xs font-semibold tracking-wider text-center uppercase font-srProDisplay text-muted-foreground">
                  {{ day }}
                </div>
              </div>

              <!-- Calendar days -->
              <div class="grid grid-cols-7 gap-2">
                <!-- Empty cells for days before month starts -->
                <div v-for="emptyDay in emptyDaysAtStart" :key="`empty-${emptyDay}`" class="h-12"></div>

                <!-- Days of the month -->
                <button v-for="day in daysInMonth" :key="day" @click="selectDate(day)"
                  :disabled="isPastOrSameDayDate(day)" :class="[
                    'h-12 w-12 rounded-xl text-sm font-srProDisplay font-medium transition-all duration-200 flex items-center justify-center relative group',
                    isPastOrSameDayDate(day)
                      ? 'text-gray-300 cursor-not-allowed opacity-40'
                      : 'text-foreground hover:bg-primary/10 hover:text-primary hover:scale-110 hover:shadow-md',
                    isSelectedDate(day)
                      ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg scale-105 font-bold'
                      : '',
                    isToday(day) && !isSelectedDate(day)
                      ? 'bg-primary/5 border-2 border-primary/20 text-primary font-semibold'
                      : '',
                  ]">
                  {{ day }}
                  <!-- Today indicator -->
                  <div v-if="isToday(day) && !isSelectedDate(day)"
                    class="absolute w-1 h-1 transform -translate-x-1/2 rounded-full -bottom-1 left-1/2 bg-primary">
                  </div>
                  <!-- Selected indicator -->
                  <div v-if="isSelectedDate(day)"
                    class="absolute inset-0 border-2 rounded-xl border-primary/30 animate-pulse"></div>
                </button>
              </div>

              <!-- Info section -->
              <div
                class="p-4 mt-6 border bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl border-blue-200/50 dark:border-blue-800/30">
                <div class="flex items-start gap-3">
                  <div
                    class="w-6 h-6 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <v-icon name="bi-info-circle" scale="0.9" class="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p class="text-sm font-medium text-blue-800 font-srProDisplay dark:text-blue-200">
                      Delivery Information
                    </p>
                    <p class="mt-1 text-xs text-blue-600 dark:text-blue-300">
                      Orders placed today will be available for delivery from tomorrow onwards.
                      <span class="font-medium">Free delivery</span> on orders over $50.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="flex items-center justify-between gap-4 p-6 pt-4 border-t border-border/20">
              <!-- Left side - Selected date preview -->
              <div v-if="selectedDate" class="flex items-center gap-2 text-sm text-muted-foreground">
                <v-icon name="bi-calendar-check" scale="0.8" class="text-primary" />
                <span>{{ selectedDate }}</span>
              </div>
              <div v-else class="text-sm text-muted-foreground">
                No date selected
              </div>

              <!-- Right side - Action buttons -->
              <div class="flex gap-3">
                <button @click="closeCalendar"
                  class="px-4 py-2 text-sm transition-colors duration-200 font-srProDisplay text-muted-foreground hover:text-foreground">
                  Cancel
                </button>

                <button v-if="selectedDate" @click="closeCalendar"
                  class="px-6 py-2 text-sm font-medium transition-all duration-200 rounded-lg bg-primary text-primary-foreground font-srProDisplay hover:bg-primary/90">
                  Confirm
                </button>

                <!-- Disabled state when no date selected -->
                <button v-else disabled
                  class="px-6 py-2 text-sm text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed dark:bg-gray-800 font-srProDisplay">
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Props {
  modelValue?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isOpen = ref(false)
const currentDate = new Date()
const currentMonth = ref(currentDate.getMonth())
const currentYear = ref(currentDate.getFullYear())
const datePickerRef = ref<HTMLElement>()
const calendarRef = ref<HTMLElement>()

// If we're near the end of the month and no valid delivery dates remain, start with next month
const initializeCalendar = () => {
  const today = new Date()
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  const daysLeftInMonth = new Date(currentYear.value, currentMonth.value + 1, 0).getDate() - today.getDate()

  // If less than 3 days left in current month, start with next month
  if (daysLeftInMonth < 3) {
    if (currentMonth.value === 11) {
      currentMonth.value = 0
      currentYear.value++
    } else {
      currentMonth.value++
    }
  }
}

// Initialize calendar on component mount
onMounted(() => {
  initializeCalendar()
  document.addEventListener('keydown', handleKeyDown)
})

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const selectedDate = computed(() => props.modelValue)

const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
})

const emptyDaysAtStart = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 1).getDay()
})

const canGoToPreviousMonth = computed(() => {
  const today = new Date()
  const previousMonthDate = new Date(currentYear.value, currentMonth.value - 1, 1)
  const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  return previousMonthDate >= currentMonthStart
})

function toggleCalendar() {
  isOpen.value = !isOpen.value
}

function closeCalendar() {
  isOpen.value = false
}

function previousMonth() {
  // Don't allow going to previous months if they're in the past
  if (!canGoToPreviousMonth.value) return

  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

function isPastOrSameDayDate(day: number): boolean {
  const date = new Date(currentYear.value, currentMonth.value, day)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1) // Minimum delivery is tomorrow
  tomorrow.setHours(0, 0, 0, 0)
  return date < tomorrow
}

function isSelectedDate(day: number): boolean {
  if (!selectedDate.value) return false
  const [selectedDay, selectedMonth, selectedYear] = selectedDate.value.split(' ')
  const monthIndex = monthNames.findIndex(month => month.startsWith(selectedMonth))
  return (
    day === parseInt(selectedDay) &&
    currentMonth.value === monthIndex &&
    currentYear.value === parseInt(selectedYear)
  )
}

function isToday(day: number): boolean {
  const today = new Date()
  return (
    day === today.getDate() &&
    currentMonth.value === today.getMonth() &&
    currentYear.value === today.getFullYear()
  )
}

function selectDate(day: number) {
  if (isPastOrSameDayDate(day)) return

  const formattedDate = `${day} ${monthNames[currentMonth.value].slice(0, 3)}, ${currentYear.value}`
  emit('update:modelValue', formattedDate)
  closeCalendar()
}

// Close modal with Escape key
function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isOpen.value) {
    closeCalendar()
  }
}

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
/* Modal animations */
.modal-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-leave-active {
  transition: all 0.2s ease-in;
}

.modal-enter-from {
  opacity: 0;
  backdrop-filter: blur(0px);
}

.modal-leave-to {
  opacity: 0;
  backdrop-filter: blur(0px);
}

.modal-enter-from .calendar-modal {
  transform: translateY(-40px) scale(0.9);
  opacity: 0;
}

.modal-leave-to .calendar-modal {
  transform: translateY(20px) scale(0.95);
  opacity: 0;
}

.calendar-modal {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.05);
}

/* Dark mode enhancements */
.dark .calendar-modal {
  background: rgb(17 24 39);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.1);
}

/* Enhanced button animations and effects */
.calendar-modal button:not(:disabled):hover {
  transform: translateY(-1px);
}

.calendar-modal button:not(:disabled):active {
  transform: translateY(0);
}

/* Simple hover shadow for primary button */
.calendar-modal button[class*="bg-primary"]:not(:disabled):hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Enhanced focus states for accessibility */
.calendar-modal button:focus-visible {
  outline: 2px solid rgb(var(--primary));
  outline-offset: 2px;
}

/* Selected date pulse animation */
@keyframes selectedPulse {

  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(var(--primary), 0.4);
  }

  50% {
    box-shadow: 0 0 0 8px rgba(var(--primary), 0);
  }
}

.calendar-modal button[class*="bg-gradient-to-br"] {
  animation: selectedPulse 2s ease-in-out infinite;
}

/* Improved focus states */
.calendar-modal button:focus-visible {
  outline: 2px solid rgb(var(--primary));
  outline-offset: 2px;
}

/* Smooth transitions for all interactive elements */
.calendar-modal * {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Enhanced scrollbar for mobile */
@media (max-width: 640px) {
  .calendar-modal {
    max-height: 90vh;
    overflow-y: auto;
  }

  .calendar-modal::-webkit-scrollbar {
    width: 6px;
  }

  .calendar-modal::-webkit-scrollbar-track {
    background: transparent;
  }

  .calendar-modal::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }

  .dark .calendar-modal::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
  }
}

/* Gradient text effect for month/year */
.calendar-modal h4 {
  background: linear-gradient(135deg, rgb(var(--primary)) 0%, rgb(var(--primary-600, var(--primary))) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Subtle backdrop blur enhancement */
.modal-enter-active,
.modal-leave-active {
  backdrop-filter: blur(8px);
}
</style>
