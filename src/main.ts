// ========================
// CSS IMPORTS (MUST BE FIRST)
// ========================
// Import base styles before any component or framework styles to ensure correct cascade
import './assets/base.css'

// Import Swiper carousel library styles
// Required for swiper components: navigation arrows, pagination dots, etc.
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'


// ========================
// CORE DEPENDENCIES
// ========================
import { createApp } from 'vue'
import { createPinia } from 'pinia'


// ========================
// ICON SYSTEM (oh-vue-icons)
// ========================
import { OhVueIcon, addIcons } from 'oh-vue-icons'
import * as AllIcons from 'oh-vue-icons/icons'

/**
 * Global icon registration.
 * Registers a curated set of commonly used icons across the application.
 * Using a global icon component reduces boilerplate and ensures consistency.
 *
 * Icons are grouped by functionality:
 * - Navigation & UI
 * - E-commerce & Cart
 * - Authentication & User
 * - Product categories
 * - Forms & Inputs
 * - Status & Feedback
 */
addIcons(
  // ====== Navigation & UI ======
  AllIcons.HiHome,
  AllIcons.HiArrowLeft,
  AllIcons.HiArrowRight,
  AllIcons.HiChevronDown,
  AllIcons.HiChevronUp,
  AllIcons.HiChevronRight,
  AllIcons.HiInformationCircle,
  AllIcons.HiAdjustments,
  AllIcons.HiViewGrid,
  AllIcons.HiPencil,
  AllIcons.HiTrash,
  AllIcons.HiX,
  AllIcons.HiXCircle,
  AllIcons.HiCheck,
  AllIcons.HiCheckCircle,
  AllIcons.HiExclamationCircle,
  AllIcons.HiBadgeCheck,

  // ====== E-commerce & Shopping ======
  AllIcons.BiShop,
  AllIcons.HiShoppingBag,
  AllIcons.HiShoppingCart,
  AllIcons.HiHeart,
  AllIcons.HiTruck,
  AllIcons.HiGift,
  AllIcons.RiCoupon2Line,
  AllIcons.FaBoxes,
  AllIcons.HiClipboardList,
  AllIcons.HiClipboardCopy,
  AllIcons.HiCollection,

  // ====== Authentication & User ======
  AllIcons.HiUserCircle,
  AllIcons.FaUserCircle,
  AllIcons.HiMail,
  AllIcons.HiKey,
  AllIcons.IoPersonAddSharp,
  AllIcons.MdLogoutOutlined,
  AllIcons.HiShieldCheck,

  // ====== Product Categories ======
  AllIcons.GiSmartphone,
  AllIcons.HiPhone,
  AllIcons.BiSmartwatch,
  AllIcons.BiCamera,
  AllIcons.IoCameraReverseOutline,
  AllIcons.LaHeadphonesSolid,
  AllIcons.BiLaptop,
  AllIcons.CoTablet,
  AllIcons.GiConsoleController,
  AllIcons.BiKeyboard,
  AllIcons.BiMouse,
  AllIcons.RiHomeWifiLine,

  // ====== Media & Audio ======
  AllIcons.HiMusicNote,

  // ====== Form & Input Controls ======
  AllIcons.HiSearch,
  AllIcons.FaSearch,
  AllIcons.HiPlus,
  AllIcons.HiMinus,
  AllIcons.HiRefresh,
  AllIcons.HiEye,
  AllIcons.HiEyeOff,
  AllIcons.HiColorSwatch,
  AllIcons.IoResize,
  AllIcons.RiSeparator,

  // ====== Payment & Checkout ======
  AllIcons.FaCreditCard,
  AllIcons.HiCreditCard,
  AllIcons.SiContactlesspayment,
  AllIcons.MdAddcircle,

  // ====== Address & Shipping ======
  AllIcons.HiLocationMarker,
  AllIcons.MdLocationon,
  AllIcons.MdLocalshipping,
  AllIcons.HiOfficeBuilding,
  AllIcons.HiGlobe,

  // ====== Device & Hardware Details ======
  AllIcons.HiChip,
  AllIcons.HiSolidChip,
  AllIcons.MdCable,
  AllIcons.GiBattery75,
  AllIcons.HiClock,
  AllIcons.HiCalendar,
  AllIcons.HiSun,
  AllIcons.HiMoon,

  // ====== Miscellaneous ======
  AllIcons.HiCube
)


// ========================
// COMPONENTS & PLUGINS
// ========================
import App from './App.vue'
import router from './router'
import { i18n } from './plugins/i18n'
import { useAuthStore } from './stores/auth'


// ========================
// APP INITIALIZATION
// ========================
const app = createApp(App)

// Register global icon component for use as <v-icon name="hi-home" />
app.component('v-icon', OhVueIcon)

// Set up state management
const pinia = createPinia()
app.use(pinia)

// Set up routing
app.use(router)

// Set up internationalization (i18n)
app.use(i18n)

// ========================
// AUTHENTICATION INITIALIZATION
// ========================
/**
 * Initialize persistent authentication state (e.g., from localStorage).
 * Must be called *after* Pinia is mounted to ensure the store is available.
 * This allows the app to restore login state on page reload.
 */
const authStore = useAuthStore()
authStore.initializeAuth()

// ========================
// MOUNT APP
// ========================
app.mount('#app')
