// Importar estilos PRIMERO (orden importante)
import './assets/base.css'
// Importar estilos de Swiper
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { OhVueIcon, addIcons } from 'oh-vue-icons'
import * as AllIcons from 'oh-vue-icons/icons'

import App from './App.vue'
import router from './router'
import { i18n } from './plugins/i18n'
import { useAuthStore } from './stores/auth'

// Add icons to the library
// Register all icons used in the project globally for consistency
addIcons(
  AllIcons.HiHome,
  AllIcons.HiArrowLeft,
  AllIcons.HiCheck,
  AllIcons.HiChevronDown,
  AllIcons.HiChevronUp,
  AllIcons.HiChevronRight,
  AllIcons.HiInformationCircle,
  AllIcons.HiArrowRight,
  AllIcons.HiShieldCheck,
  AllIcons.HiSearch,
  AllIcons.HiPlus,
  AllIcons.HiMinus,
  AllIcons.HiRefresh,
  AllIcons.HiEye,
  AllIcons.HiArrowsExpand,
  AllIcons.HiAdjustments,
  AllIcons.BiShop,
  AllIcons.HiChat,
  AllIcons.HiUsers,
  AllIcons.HiUserCircle,
  AllIcons.FaUserCircle,
  AllIcons.HiMail,
  AllIcons.HiKey,
  AllIcons.IoPersonAddSharp,
  AllIcons.MdLogoutOutlined,
  AllIcons.HiShoppingBag,

  AllIcons.HiShoppingCart,
  AllIcons.HiHeart,
  AllIcons.HiTruck,
  AllIcons.FaCreditCard,
  AllIcons.HiCreditCard,
  AllIcons.HiCheckCircle,
  AllIcons.HiXCircle,
  AllIcons.HiBadgeCheck,
  AllIcons.HiExclamationCircle,
  AllIcons.BiStarFill,
  AllIcons.BiStar,
  AllIcons.BiStarHalf,
  AllIcons.HiClipboardCopy,
  AllIcons.HiClipboardList,
  AllIcons.HiViewGrid,
  AllIcons.HiPencil,
  AllIcons.HiTrash,
  AllIcons.FaBoxes,
  AllIcons.RiCoupon2Line,
  AllIcons.HiCollection,
  AllIcons.HiChip,
  AllIcons.HiSolidChip,
  AllIcons.HiPhone,
  AllIcons.HiLocationMarker,
  AllIcons.HiGlobe,
  AllIcons.HiOfficeBuilding,
  AllIcons.HiCalendar,
  AllIcons.HiCube,
  AllIcons.HiClock,
  AllIcons.HiSun,
  AllIcons.HiMoon,
  AllIcons.HiColorSwatch,
  AllIcons.RiSeparator,
  AllIcons.IoResize,
  AllIcons.BiSmartwatch,
  AllIcons.BiCamera,
  AllIcons.IoCameraReverseOutline,
  AllIcons.LaHeadphonesSolid,
  AllIcons.BiLaptop,
  AllIcons.BiTrash,
  AllIcons.GiSmartphone,
  AllIcons.CoTablet,
  AllIcons.GiConsoleController,
  AllIcons.BiKeyboard,
  AllIcons.BiMouse,
  AllIcons.RiHomeWifiLine,
  AllIcons.HiMusicNote,
  AllIcons.MdCable,
  AllIcons.MdAddcircle,
  AllIcons.MdLocationon,
  AllIcons.MdLocalshipping,
  AllIcons.SiContactlesspayment,
  AllIcons.FaSearch,
  AllIcons.GiBattery75,
  AllIcons.HiTruck,
  AllIcons.HiClipboardList,
  AllIcons.HiGift,
  AllIcons.HiHeart,
  AllIcons.HiEye,
  AllIcons.HiEyeOff,
  AllIcons.HiX,
  AllIcons.HiXCircle
)

const app = createApp(App)

// Register OhVueIcon component globally
app.component('v-icon', OhVueIcon)

const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(i18n)

// Initialize auth store after Pinia is set up
const authStore = useAuthStore()
authStore.initializeAuth()

app.mount('#app')
