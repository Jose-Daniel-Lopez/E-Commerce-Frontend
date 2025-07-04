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
  AllIcons.GiSmartphone,
  AllIcons.CoTablet,
  AllIcons.GiConsoleController,
  AllIcons.BiKeyboard,
  AllIcons.BiMouse,
  AllIcons.RiHomeWifiLine,
  AllIcons.HiMusicNote,
  AllIcons.MdCable,
  AllIcons.FaSearch,
  AllIcons.GiBattery75
)

const app = createApp(App)

// Register OhVueIcon component globally
app.component('v-icon', OhVueIcon)

app.use(createPinia())
app.use(router)
app.use(i18n)

app.mount('#app')
