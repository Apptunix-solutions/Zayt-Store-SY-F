import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { readStoredJson, readRaw, writeRaw, removeRaw } from '@/lib/storage'

export interface UserAccount {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  role: 'customer' | 'merchant'
  provider?: 'local' | 'google' | 'facebook'
  location: string
}

const STORAGE_KEY = 'zaytstore_auth_user'
const LOCATION_KEY = 'zaytstore_current_location'

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80'
const GOOGLE_AVATAR =
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&h=120&q=80'
const FACEBOOK_AVATAR =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80'

const defaultUser: UserAccount = {
  id: 'usr-101',
  name: 'عمر حسن الخالد',
  email: 'omar.khalid@gmail.com',
  phone: '0944 123 456',
  avatar: DEFAULT_AVATAR,
  role: 'customer',
  provider: 'local',
  location: 'دمشق',
}

export const useAuthStore = defineStore('auth', () => {
  // قراءة آمنة: بيانات تالفة أو مُعدَّلة في التخزين لا تُسقط التطبيق — نعيد الحساب الافتراضي.
  const initialUser = readStoredJson<UserAccount | null>(STORAGE_KEY, null, (value): boolean => {
    if (typeof value !== 'object' || value === null) return false
    const candidate = value as Partial<UserAccount>
    return typeof candidate.id === 'string' && typeof candidate.name === 'string'
  })

  // By default, if nothing saved, we can start with true so client can see avatar and notifications immediately!
  const user = ref<UserAccount | null>(initialUser ?? defaultUser)
  const isLoggedIn = computed(() => user.value !== null)

  const savedLoc = readRaw(LOCATION_KEY)
  const selectedLocation = ref<string>(savedLoc || 'دمشق')

  const supportPhone = ref('+963 11 9876')
  const supportMobile = ref('+963 944 000 888')

  function save() {
    if (typeof window !== 'undefined') {
      if (user.value) {
        writeRaw(STORAGE_KEY, JSON.stringify(user.value))
      } else {
        removeRaw(STORAGE_KEY)
      }
    }
  }

  function setLocation(loc: string) {
    selectedLocation.value = loc
    writeRaw(LOCATION_KEY, loc)
  }

  /** ينشئ جلسة مستخدم من بيانات مُعمّمة ويحفظها — يجمع تسجيل الدخول الثلاث في مكان واحد. */
  function setSession(input: Omit<UserAccount, 'location'> & { location?: string }) {
    const { location, ...rest } = input
    user.value = { ...rest, location: location ?? selectedLocation.value }
    save()
  }

  function login(credentials: { email: string; name?: string; role?: 'customer' | 'merchant' }) {
    setSession({
      id: 'usr-' + Date.now().toString(36),
      name: credentials.name || credentials.email.split('@')[0] || 'عمر خالد',
      email: credentials.email,
      phone: '0944 123 456',
      avatar: DEFAULT_AVATAR,
      role: credentials.role || 'customer',
      provider: 'local',
    })
  }

  function loginWithGoogle() {
    setSession({
      id: 'goog-' + Date.now().toString(36),
      name: 'أحمد المحمد',
      email: 'ahmed.mohamad@gmail.com',
      phone: '0991 888 777',
      avatar: GOOGLE_AVATAR,
      role: 'customer',
      provider: 'google',
    })
  }

  function loginWithFacebook() {
    setSession({
      id: 'fb-' + Date.now().toString(36),
      name: 'سامر خليل',
      email: 'samer.khalil@facebook.com',
      phone: '0933 555 444',
      avatar: FACEBOOK_AVATAR,
      role: 'customer',
      provider: 'facebook',
    })
  }

  function logout() {
    user.value = null
    save()
  }

  function updateProfile(patch: Partial<UserAccount>) {
    if (user.value) {
      user.value = { ...user.value, ...patch }
      save()
    }
  }

  return {
    user,
    isLoggedIn,
    selectedLocation,
    supportPhone,
    supportMobile,
    setLocation,
    login,
    loginWithGoogle,
    loginWithFacebook,
    logout,
    updateProfile,
  }
})
