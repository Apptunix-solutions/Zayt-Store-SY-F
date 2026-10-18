<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Bell,
  CarFront,
  ChevronLeft,
  LogOut,
  MapPin,
  Package,
  ShieldCheck,
  Store,
  UserRound,
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useLocaleStore } from '@/stores/locale'
import { useClickOutside } from '@/composables/useClickOutside'
import { toast } from '@/lib/toast'

const auth = useAuthStore()
const locale = useLocaleStore()
const router = useRouter()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const userInitials = computed(() => {
  if (!auth.user?.name) return 'ح'
  const parts = auth.user.name.trim().split(/\s+/)
  if (parts.length >= 2) return parts[0][0] + parts[1][0]
  return parts[0].substring(0, 2)
})

function navigateTo(path: string) {
  isOpen.value = false
  router.push(path)
}

useClickOutside(dropdownRef, () => {
  isOpen.value = false
})

function handleLogout() {
  isOpen.value = false
  auth.logout()
  toast.info(
    locale.isArabic ? 'تم تسجيل الخروج بنجاح' : 'Logged out successfully',
    locale.isArabic ? 'نراك قريباً في ZaytStore!' : 'See you soon at ZaytStore!',
  )
}
</script>

<template>
  <div v-if="auth.isLoggedIn" ref="dropdownRef" class="relative" :dir="locale.dir">
    <!-- User Avatar Trigger Button -->
    <button
      type="button"
      :aria-expanded="isOpen"
      :title="
        (locale.isArabic ? 'حسابي: ' : 'My Account: ') +
        (auth.user?.name || (locale.isArabic ? 'مستخدم' : 'User'))
      "
      class="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#E8A020]/40 p-0.5 transition duration-200 hover:border-[#E8A020] hover:shadow-[0_0_12px_rgba(232,160,32,0.35)] focus:outline-none"
      @click="isOpen = !isOpen"
    >
      <img
        v-if="auth.user?.avatar"
        :src="auth.user.avatar"
        :alt="auth.user.name"
        class="h-full w-full rounded-full object-cover"
      />
      <span
        v-else
        class="grid h-full w-full place-items-center rounded-full bg-[#0F3D20] text-[11px] font-bold text-[#E8A020]"
      >
        {{ userInitials }}
      </span>

      <!-- Online Status Dot -->
      <span
        class="absolute -bottom-0.5 -end-0.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--bg)] bg-emerald-500"
      ></span>
    </button>

    <!-- Backdrop for mobile -->
    <div
      v-if="isOpen"
      class="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs sm:hidden"
      aria-hidden="true"
      @click="isOpen = false"
    ></div>

    <!-- Profile Menu Dropdown -->
    <Transition name="menu-pop">
      <div
        v-if="isOpen"
        class="fixed start-3 end-3 top-[58px] z-50 max-h-[85vh] overflow-y-auto rounded-2xl border border-[var(--line-strong)] bg-[var(--panel)] shadow-[0_24px_64px_rgba(0,0,0,0.65)] backdrop-blur-2xl sm:absolute sm:inset-x-auto sm:start-0 sm:end-auto sm:top-full sm:mt-2 sm:w-72"
      >
        <!-- User Info Header -->
        <div class="border-b border-[var(--line)] bg-[var(--glass)] p-4">
          <div class="flex items-center gap-3">
            <div
              class="relative grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-[#E8A020]/40 overflow-hidden"
            >
              <img
                v-if="auth.user?.avatar"
                :src="auth.user.avatar"
                :alt="auth.user.name"
                class="h-full w-full object-cover"
              />
              <span v-else class="text-xs font-bold text-[#E8A020]">{{ userInitials }}</span>
            </div>
            <div class="min-w-0 flex-1 text-start">
              <div class="flex items-center gap-1.5">
                <p class="truncate text-sm font-extrabold text-[var(--text)]">
                  {{ auth.user?.name }}
                </p>
                <ShieldCheck :size="14" class="shrink-0 text-[#E8A020]" />
              </div>
              <p class="truncate text-[11px] text-[var(--muted)]">
                {{ auth.user?.email || auth.user?.phone }}
              </p>
              <span
                class="mt-1 inline-block rounded-md bg-[#E8A020]/15 px-2 py-0.5 text-[11px] font-bold text-[#E8A020]"
              >
                {{
                  auth.user?.role === 'merchant'
                    ? locale.isArabic
                      ? 'تاجر معتمد'
                      : 'Verified Merchant'
                    : locale.isArabic
                      ? 'زبون موثق'
                      : 'Verified Customer'
                }}
              </span>
            </div>
          </div>
        </div>

        <!-- Links List -->
        <div class="p-2 space-y-0.5 text-xs font-semibold">
          <button
            type="button"
            class="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-[var(--text)] transition hover:bg-[var(--glass-strong)] hover:text-[#E8A020]"
            @click="navigateTo('/profile')"
          >
            <UserRound :size="16" class="text-[var(--muted)]" />
            <span class="flex-1">{{ locale.isArabic ? 'الملف الشخصي' : 'My Profile' }}</span>
            <ChevronLeft
              :size="14"
              class="text-[var(--muted)]"
              :class="{ 'rotate-180': locale.isEnglish }"
            />
          </button>

          <button
            type="button"
            class="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-[var(--text)] transition hover:bg-[var(--glass-strong)] hover:text-[#E8A020]"
            @click="navigateTo('/profile?tab=orders')"
          >
            <Package :size="16" class="text-[var(--muted)]" />
            <span class="flex-1">{{
              locale.isArabic ? 'طلباتي والتتبع' : 'My Orders & Tracking'
            }}</span>
            <ChevronLeft
              :size="14"
              class="text-[var(--muted)]"
              :class="{ 'rotate-180': locale.isEnglish }"
            />
          </button>

          <button
            type="button"
            class="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-[var(--text)] transition hover:bg-[var(--glass-strong)] hover:text-[#E8A020]"
            @click="navigateTo('/garage')"
          >
            <CarFront :size="16" class="text-[var(--muted)]" />
            <span class="flex-1">{{
              locale.isArabic ? 'كراجي وسياراتي' : 'My Garage & Vehicles'
            }}</span>
            <ChevronLeft
              :size="14"
              class="text-[var(--muted)]"
              :class="{ 'rotate-180': locale.isEnglish }"
            />
          </button>

          <button
            type="button"
            class="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-[var(--text)] transition hover:bg-[var(--glass-strong)] hover:text-[#E8A020]"
            @click="navigateTo('/profile?tab=addresses')"
          >
            <MapPin :size="16" class="text-[var(--muted)]" />
            <span class="flex-1">{{
              locale.isArabic ? 'عناوين التوصيل' : 'Delivery Addresses'
            }}</span>
            <ChevronLeft
              :size="14"
              class="text-[var(--muted)]"
              :class="{ 'rotate-180': locale.isEnglish }"
            />
          </button>

          <button
            type="button"
            class="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-[var(--text)] transition hover:bg-[var(--glass-strong)] hover:text-[#E8A020]"
            @click="navigateTo('/profile?tab=notifications')"
          >
            <Bell :size="16" class="text-[var(--muted)]" />
            <span class="flex-1">{{
              locale.isArabic ? 'مركز الإشعارات والتنبيهات' : 'Notifications Center'
            }}</span>
            <ChevronLeft
              :size="14"
              class="text-[var(--muted)]"
              :class="{ 'rotate-180': locale.isEnglish }"
            />
          </button>

          <button
            v-if="auth.user?.role === 'merchant'"
            type="button"
            class="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-start text-[var(--text)] transition hover:bg-[var(--glass-strong)] hover:text-[#E8A020]"
            @click="navigateTo('/merchants')"
          >
            <Store :size="16" class="text-[var(--muted)]" />
            <span class="flex-1">{{
              locale.isArabic ? 'لوحة تحكم المتجر' : 'Store Dashboard'
            }}</span>
            <ChevronLeft
              :size="14"
              class="text-[var(--muted)]"
              :class="{ 'rotate-180': locale.isEnglish }"
            />
          </button>
        </div>

        <!-- Footer: Logout Button -->
        <div class="border-t border-[var(--line)] p-2">
          <button
            type="button"
            class="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-start text-xs font-bold text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
            @click="handleLogout"
          >
            <LogOut :size="15" />
            <span>{{ locale.isArabic ? 'تسجيل الخروج' : 'Log Out' }}</span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.menu-pop-enter-active,
.menu-pop-leave-active {
  transition:
    opacity 160ms ease,
    transform 160ms ease;
}
.menu-pop-enter-from,
.menu-pop-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.97);
}
</style>
