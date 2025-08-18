<template>
  <div class="relative">
    <button
      @click="toggleCalendar"
      :class="[
        'px-4 py-2 border border-border rounded-md bg-background font-srProDisplay text-foreground transition-colors duration-200',
        'hover:border-border focus:outline-none focus:border-border',
        isOpen ? 'border-border' : '',
      ]"
    >
      {{ selectedDate || 'Select Date' }}
      <v-icon
        name="md-keyboardarrowdown"
        scale="1.2"
        :class="['ml-2 transition-transform duration-200', isOpen ? 'rotate-180' : '']"
      />
    </button>

    <!-- Calendar Dropdown -->
    <div
      v-if="isOpen"
  class="absolute top-full mt-2 bg-background border border-border rounded-lg shadow-xl z-[9999] min-w-[280px] max-w-[280px] calendar-dropdown"
      style="box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);"
    >
      <!-- Calendar Header -->
  <div class="flex items-center justify-between p-4 border-b border-border">
        <button
          @click="previousMonth"
          :disabled="!canGoToPreviousMonth"
          :class="[
            'p-1 rounded transition-colors',
            canGoToPreviousMonth
              ? 'hover:bg-gray-100 text-foreground'
              : 'text-gray-300 cursor-not-allowed'
          ]"
        >
          <v-icon name="md-chevronleft" scale="1.2" />
        </button>
  <span class="font-srProDisplay font-semibold text-foreground">
          {{ monthNames[currentMonth] }} {{ currentYear }}
        </span>
        <button
          @click="nextMonth"
          class="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <v-icon name="md-chevronright" scale="1.2" />
        </button>
      </div>

      <!-- Calendar Grid -->
      <div class="p-4">
        <!-- Days of week header -->
        <div class="grid grid-cols-7 gap-1 mb-2">
          <div
            v-for="day in dayNames"
            :key="day"
            class="text-center text-sm font-srProDisplay text-gray-500 py-2"
          >
            {{ day }}
          </div>
        </div>

        <!-- Calendar days -->
        <div class="grid grid-cols-7 gap-1">
          <!-- Empty cells for days before month starts -->
          <div
            v-for="emptyDay in emptyDaysAtStart"
            :key="`empty-${emptyDay}`"
            class="h-8"
          ></div>

          <!-- Days of the month -->
          <button
            v-for="day in daysInMonth"
            :key="day"
            @click="selectDate(day)"
            :disabled="isPastOrSameDayDate(day)"
            :class="[
              'h-8 w-8 rounded text-sm font-srProDisplay transition-colors',
              isPastOrSameDayDate(day)
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-foreground hover:bg-gray-100',
              isSelectedDate(day)
                ? 'bg-primary text-primary-foreground hover:opacity-95'
                : '',
            ]"
          >
            {{ day }}
          </button>
        </div>

        <!-- Info text -->
  <div class="mt-3 pt-3 border-t border-border">
          <p class="text-xs font-srProDisplay text-gray-500 text-center">
            Delivery available from tomorrow onwards
          </p>
        </div>
      </div>
    </div>
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
  document.addEventListener('click', handleClickOutside)
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

function selectDate(day: number) {
  if (isPastOrSameDayDate(day)) return

  const formattedDate = `${day} ${monthNames[currentMonth.value].slice(0, 3)}, ${currentYear.value}`
  emit('update:modelValue', formattedDate)
  closeCalendar()
}

// Close calendar when clicking outside
function handleClickOutside(event: Event) {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    closeCalendar()
  }
}

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.calendar-dropdown {
  /* Default to right alignment */
  right: 0;
}

/* If there's not enough space on the right, align to left */
@media (max-width: 768px) {
  .calendar-dropdown {
    right: auto;
    left: 0;
  }
}

/* Ensure the calendar doesn't get cut off at viewport edges */
.calendar-dropdown {
  transform: translateX(0);
}

/* If the dropdown would extend beyond the right edge of the viewport */
@supports (width: fit-content) {
  .calendar-dropdown {
    left: auto;
    right: 0;
    transform: translateX(0);
  }

  /* On smaller screens, prefer left alignment */
  @media (max-width: 640px) {
    .calendar-dropdown {
      left: 0;
      right: auto;
    }
  }
}
</style>
