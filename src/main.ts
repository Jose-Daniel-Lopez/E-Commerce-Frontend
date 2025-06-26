import './assets/base.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { OhVueIcon, addIcons } from 'oh-vue-icons'
import {
  HiHome,
  HiUsers,
  HiViewGrid,
  HiShoppingBag,
  HiPlus,
  HiPencil,
  HiTrash,
  HiEye,
  HiRefresh,
  HiSearch,
  HiChevronDown,
  HiChevronUp,
  HiExclamationCircle,
  HiShoppingCart,
  HiArrowLeft,
  HiStar,
  HiCalendar,
  HiSun,
  HiMoon,
  FaUserCircle,
  MdLogoutOutlined,
  IoPersonAddSharp,
  FaBoxes,
  RiCoupon2Line,
  HiXCircle,
  HiBadgeCheck,
  HiCheckCircle,
  HiClipboardCopy
} from 'oh-vue-icons/icons'

import App from './App.vue'
import router from './router'

// Add icons to the library
addIcons(
  HiHome,
  HiUsers,
  HiViewGrid,
  HiShoppingBag,
  HiPlus,
  HiPencil,
  HiTrash,
  HiEye,
  HiRefresh,
  HiSearch,
  HiChevronDown,
  HiChevronUp,
  HiExclamationCircle,
  HiShoppingCart,
  HiArrowLeft,
  HiStar,
  HiCalendar,
  HiSun,
  HiMoon,
  FaUserCircle,
  MdLogoutOutlined,
  IoPersonAddSharp,
  FaBoxes,
  RiCoupon2Line,
  HiXCircle,
  HiBadgeCheck,
  HiCheckCircle,
  HiClipboardCopy
)

const app = createApp(App)

// Register OhVueIcon component globally
app.component('v-icon', OhVueIcon)

app.use(createPinia())
app.use(router)

app.mount('#app')
