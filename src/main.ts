// Importar estilos PRIMERO (orden importante)
import './assets/base.css'
// Importar estilos de Swiper
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { OhVueIcon, addIcons } from 'oh-vue-icons'
import {
  // Navigation & Layout Icons
  HiHome,
  HiArrowLeft,
  HiCheck,
  HiChevronDown,
  HiChevronUp,
  HiChevronRight,
  HiInformationCircle,
  HiArrowRight,

  // User Interface Icons
  HiSearch,
  HiPlus,
  HiMinus,
  HiRefresh,
  HiEye,
  HiArrowsExpand,
  HiAdjustments,
  HiShieldCheck,
  HiChat,

  // User & Account Icons
  HiUsers,
  HiUserCircle,
  FaUserCircle,
  HiMail,
  HiKey,
  IoPersonAddSharp,
  MdLogoutOutlined,

  // E-commerce Icons
  HiShoppingBag,
  HiShoppingCart,
  HiHeart,
  HiTruck,
  FaCreditCard,
  HiCreditCard,

  // Status & Feedback Icons
  HiCheckCircle,
  HiXCircle,
  HiBadgeCheck,
  HiExclamationCircle,
  BiStarFill,
  HiStar,
  HiClipboardCopy,
  HiClipboardList,

  // Admin & Management Icons
  HiViewGrid,
  HiPencil,
  HiTrash,
  FaBoxes,
  RiCoupon2Line,
  HiCollection,
  HiCube,

  // Location & Contact Icons
  HiPhone,
  HiLocationMarker,
  HiGlobe,
  HiOfficeBuilding,

  // Time & Calendar Icons
  HiCalendar,
  HiClock,

  // Theme Icons
  HiSun,
  HiMoon,

  // Utility Icons
  HiColorSwatch,
  RiSeparator,

  // Category Icons - Electronics
  GiSmartphone,
  BiSmartwatch,
  BiCamera,
  LaHeadphonesSolid,
  BiLaptop,
  CoTablet,

  // Category Icons - Gaming & Peripherals
  GiConsoleController,
  BiKeyboard,
  BiMouse,

  // Category Icons - Home & Audio
  RiHomeWifiLine,
  HiMusicNote,
  MdCable
} from 'oh-vue-icons/icons'

import App from './App.vue'
import router from './router'
import { i18n } from './plugins/i18n'

// Add icons to the library
addIcons(
  // Navigation & Layout Icons
  HiHome,
  HiArrowLeft,
  HiCheck,
  HiChevronDown,
  HiChevronUp,
  HiChevronRight,
  HiInformationCircle,
  HiArrowRight,

  // User Interface Icons
  HiSearch,
  HiPlus,
  HiMinus,
  HiRefresh,
  HiEye,
  HiArrowsExpand,
  HiAdjustments,
  HiShieldCheck,
  HiChat,

  // User & Account Icons
  HiUsers,
  HiUserCircle,
  FaUserCircle,
  HiMail,
  HiKey,
  IoPersonAddSharp,
  MdLogoutOutlined,

  // E-commerce Icons
  HiShoppingBag,
  HiShoppingCart,
  HiHeart,
  HiTruck,
  FaCreditCard,
  HiCreditCard,

  // Status & Feedback Icons
  HiCheckCircle,
  HiXCircle,
  HiBadgeCheck,
  HiExclamationCircle,
  BiStarFill,
  HiStar,
  HiClipboardCopy,
  HiClipboardList,

  // Admin & Management Icons
  HiViewGrid,
  HiPencil,
  HiTrash,
  FaBoxes,
  RiCoupon2Line,
  HiCollection,
  HiCube,

  // Location & Contact Icons
  HiPhone,
  HiLocationMarker,
  HiGlobe,
  HiOfficeBuilding,

  // Time & Calendar Icons
  HiCalendar,
  HiClock,

  // Theme Icons
  HiSun,
  HiMoon,

  // Utility Icons
  HiColorSwatch,
  RiSeparator,

  // Category Icons - Electronics
  GiSmartphone,
  BiSmartwatch,
  BiCamera,
  LaHeadphonesSolid,
  BiLaptop,
  CoTablet,

  // Category Icons - Gaming & Peripherals
  GiConsoleController,
  BiKeyboard,
  BiMouse,

  // Category Icons - Home & Audio
  RiHomeWifiLine,
  HiMusicNote,
  MdCable
)

const app = createApp(App)

// Register OhVueIcon component globally
app.component('v-icon', OhVueIcon)

app.use(createPinia())
app.use(router)
app.use(i18n)

app.mount('#app')
