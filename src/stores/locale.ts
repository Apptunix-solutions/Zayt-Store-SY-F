import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { readRaw, writeRaw } from '@/lib/storage'

export type AppLocale = 'ar' | 'en'

const STORAGE_KEY = 'zaytstore-lang'

const translations: Record<string, { ar: string; en: string }> = {
  home: { ar: 'الرئيسية', en: 'Home' },
  products: { ar: 'المنتجات', en: 'Products' },
  merchants: { ar: 'المتاجر', en: 'Stores' },
  about: { ar: 'من نحن', en: 'About Us' },
  login: { ar: 'دخول', en: 'Login' },
  openStore: { ar: 'افتح متجرك', en: 'Open Store' },
  search: { ar: 'بحث', en: 'Search' },
  cart: { ar: 'السلة', en: 'Cart' },
  account: { ar: 'حسابي', en: 'Account' },
  profile: { ar: 'الملف الشخصي', en: 'Profile' },
  orders: { ar: 'طلباتي', en: 'My Orders' },
  garage: { ar: 'كراجي وسياراتي', en: 'My Garage' },
  addresses: { ar: 'عناوين التوصيل', en: 'Addresses' },
  notifications: { ar: 'الإشعارات', en: 'Notifications' },
  logout: { ar: 'تسجيل الخروج', en: 'Logout' },
  syria: { ar: 'سوريا', en: 'Syria' },
  allRightsReserved: { ar: 'جميع الحقوق محفوظة', en: 'All rights reserved' },
  privacy: { ar: 'سياسة الخصوصية', en: 'Privacy Policy' },
  terms: { ar: 'شروط الاستخدام', en: 'Terms of Use' },
  help: { ar: 'مركز المساعدة', en: 'Help Center' },
  contactUs: { ar: 'تواصل معنا', en: 'Contact Us' },
  newsletterTitle: { ar: 'اشترك بقائمتنا البريدية', en: 'Subscribe to our newsletter' },
  newsletterPlaceholder: { ar: 'بريدك الإلكتروني', en: 'Enter your email' },
  followUs: { ar: 'تابعنا', en: 'Follow Us' },
  coverage: { ar: 'التغطية', en: 'Coverage' },
  governoratesCount: { ar: '14 محافظة في سوريا', en: '14 Governorates in Syria' },
}

export const useLocaleStore = defineStore('locale', () => {
  const saved = readRaw(STORAGE_KEY) as AppLocale | null
  const current = ref<AppLocale>(saved === 'en' ? 'en' : 'ar')

  const isArabic = computed(() => current.value === 'ar')
  const isEnglish = computed(() => current.value === 'en')
  const dir = computed(() => (current.value === 'ar' ? 'rtl' : 'ltr'))

  function t(key: string): string {
    const item = translations[key]
    if (!item) return key
    return item[current.value] || item.ar || key
  }

  function apply(lang: AppLocale) {
    current.value = lang
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    }
    if (typeof window !== 'undefined') {
      writeRaw(STORAGE_KEY, lang)
    }
  }

  function toggle() {
    apply(current.value === 'ar' ? 'en' : 'ar')
  }

  // Initialize DOM attributes
  if (typeof document !== 'undefined') {
    document.documentElement.lang = current.value
    document.documentElement.dir = current.value === 'ar' ? 'rtl' : 'ltr'
  }

  return {
    current,
    isArabic,
    isEnglish,
    dir,
    t,
    apply,
    toggle,
  }
})
