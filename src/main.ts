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
 * - Product categories (Mobile & Compute, Input & Control)
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
  AllIcons.FaTimes,         // FontAwesome X/close icon
  AllIcons.HiCheck,
  AllIcons.HiCheckCircle,
  AllIcons.HiExclamationCircle,
  AllIcons.HiBadgeCheck,
  AllIcons.HiUsers,
  AllIcons.HiMenu,

  // ====== Review Stars ======
  AllIcons.BiStarFill,
  AllIcons.BiStar,
  AllIcons.FaStar,          // FontAwesome solid star
  AllIcons.FaRegularStar,   // FontAwesome outlined star

  // ====== E-commerce & Shopping ======
  AllIcons.BiShop,
  AllIcons.HiShoppingBag,
  AllIcons.HiShoppingCart,
  AllIcons.HiHeart,
  AllIcons.FaHeart,         // FontAwesome solid heart
  AllIcons.FaRegularHeart,  // FontAwesome outlined heart (fa-heart-o)
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
  // --- Mobile & Compute ---
  AllIcons.GiSmartphone,     // Smartphones
  AllIcons.HiPhone,          // Alternative phone icon
  AllIcons.CoTablet,         // Tablets
  AllIcons.BiLaptop,         // Laptops
  AllIcons.BiNintendoSwitch,     // Handhelds (e.g., Steam Deck)

  // --- Input & Control ---
  AllIcons.BiKeyboard,       // Keyboards
  AllIcons.BiMouse,          // Mice
  AllIcons.GiConsoleController, // Controllers (gamepads)

  // ====== Forms & Inputs ======
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
  AllIcons.FaRegularClock,  // FontAwesome outlined clock (fa-clock-o)

  // ====== Payment & Checkout ======
  AllIcons.FaCreditCard,
  AllIcons.HiCreditCard,
  AllIcons.SiContactlesspayment,
  AllIcons.MdAddcircle,
  AllIcons.BiApple,
  AllIcons.BiPaypal,

  // ====== Address & Shipping ======
  AllIcons.HiLocationMarker,
  AllIcons.MdLocationon,
  AllIcons.MdLocalshipping,
  AllIcons.HiOfficeBuilding,
  AllIcons.HiGlobe,

  // ====== Device & Hardware Details ======
  AllIcons.HiChip,           // CPU
  AllIcons.HiSolidChip,      // GPU / Chip
  AllIcons.HiCube,           // Generic product placeholder
  AllIcons.HiDatabase,       // Storage
  AllIcons.HiRefresh,        // Refresh rate (already added above but kept for reference)
  AllIcons.BiCamera,         // Camera
  AllIcons.IoCameraReverseOutline, // Front camera
  AllIcons.GiBattery75,      // Battery
  AllIcons.IoSettings,       // Operating system / settings
  AllIcons.IoLocate,         // DPI / precision
  AllIcons.HiLightningBolt,  // Polling rate / speed
  AllIcons.IoKeypad,         // Switch type / keyboard
  AllIcons.IoBulb,           // Backlighting
  AllIcons.IoOptions,        // Programmable buttons / options
  AllIcons.IoHandLeft,       // Ergonomic design
  AllIcons.HiClock,          // Battery life, refresh rate
  AllIcons.HiSun,            // Backlighting
  AllIcons.HiMoon,           // Dark mode / backlighting
  AllIcons.HiDesktopComputer, // System theme option
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
// THEME INITIALIZATION
// ========================
/**
 * Initialize theme system after Pinia is available.
 * This sets up the initial theme based on user preference or system default.
 */
import { useThemeStore } from '@/stores/theme'
const themeStore = useThemeStore()
themeStore.initializeTheme()

// ========================
// MOUNT APP
// ========================
app.mount('#app')
