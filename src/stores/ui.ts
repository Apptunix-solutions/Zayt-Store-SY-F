import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { readRaw, writeRaw } from '@/lib/storage'

export type Theme = 'dark' | 'light'
export type AuthMode = 'login' | 'register'

const urlTheme =
  typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('theme') : null
const savedTheme =
  urlTheme === 'light' || urlTheme === 'dark' ? urlTheme : readRaw('zaytstore-theme')

export const useUiStore = defineStore('ui', () => {
  const theme = ref<Theme>(savedTheme === 'light' ? 'light' : 'dark')
  const isLight = computed(() => theme.value === 'light')

  /* ═══ نافذة تسجيل الدخول / إنشاء حساب (Modal) ═══ */
  const authOpen = ref(false)
  const authMode = ref<AuthMode>('login')
  const isAuthOpen = computed(() => authOpen.value)

  function openAuth(mode: AuthMode = 'login') {
    authMode.value = mode
    authOpen.value = true
  }

  function closeAuth() {
    authOpen.value = false
  }

  function setAuthMode(mode: AuthMode) {
    authMode.value = mode
  }

  function apply(nextTheme: Theme) {
    theme.value = nextTheme
    document.documentElement.dataset.theme = nextTheme
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', nextTheme === 'light' ? '#F4F6F8' : '#0B0D10')
    writeRaw('zaytstore-theme', nextTheme)
  }

  function toggle() {
    apply(isLight.value ? 'dark' : 'light')
  }

  apply(theme.value)

  return {
    theme,
    isLight,
    apply,
    toggle,
    authOpen,
    authMode,
    isAuthOpen,
    openAuth,
    closeAuth,
    setAuthMode,
  }
})
