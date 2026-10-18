<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Bell,
  CheckCheck,
  ChevronLeft,
  Package,
  Percent,
  ShieldCheck,
  Store,
  Trash2,
  X,
} from 'lucide-vue-next'
import { useNotificationsStore, type AppNotification } from '@/stores/notifications'
import { useLocaleStore } from '@/stores/locale'
import { useClickOutside } from '@/composables/useClickOutside'
import { toast } from '@/lib/toast'

const notifStore = useNotificationsStore()
const locale = useLocaleStore()
const router = useRouter()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const filterTab = ref<'all' | 'unread'>('all')

const filteredList = computed(() => {
  if (filterTab.value === 'unread') {
    return notifStore.list.filter((n) => !n.isRead)
  }
  return notifStore.list
})

function handleItemClick(item: AppNotification) {
  notifStore.markAsRead(item.id)
  isOpen.value = false
  if (item.link) {
    router.push(item.link)
  }
}

function handleMarkAll() {
  notifStore.markAllAsRead()
  toast.success(
    locale.isArabic ? 'تم تحديد جميع الإشعارات كمقروءة' : 'All notifications marked as read',
  )
}

function handleDelete(id: string, event: MouseEvent) {
  event.stopPropagation()
  notifStore.remove(id)
}

function goToFullNotifications() {
  isOpen.value = false
  router.push('/profile?tab=notifications')
}

useClickOutside(dropdownRef, () => {
  isOpen.value = false
})
</script>

<template>
  <div ref="dropdownRef" class="relative" :dir="locale.dir">
    <!-- Bell Trigger Button -->
    <button
      type="button"
      :aria-label="locale.isArabic ? 'الإشعارات والتنبيهات' : 'Notifications & Alerts'"
      :title="
        (locale.isArabic ? 'الإشعارات' : 'Notifications') +
        (notifStore.unreadCount
          ? ` (${notifStore.unreadCount} ${locale.isArabic ? 'جديدة' : 'new'})`
          : '')
      "
      class="relative grid h-8 w-8 place-items-center rounded-md border border-[var(--line)] text-[var(--muted)] transition hover:border-[#E8A020]/40 hover:text-[var(--text)]"
      :class="{ 'border-[#E8A020]/60 text-[#E8A020] bg-[#E8A020]/10': isOpen }"
      @click="isOpen = !isOpen"
    >
      <Bell :size="15" />
      <!-- Unread Badge Counter -->
      <span
        v-if="notifStore.unreadCount > 0"
        class="absolute -start-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[11px] leading-none font-black text-white shadow-[0_0_8px_rgba(239,68,68,0.7)]"
      >
        {{ notifStore.unreadCount }}
      </span>
    </button>

    <!-- Backdrop for mobile -->
    <div
      v-if="isOpen"
      class="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs sm:hidden"
      aria-hidden="true"
      @click="isOpen = false"
    ></div>

    <!-- Dropdown Modal / Popover -->
    <Transition name="notif-pop">
      <div
        v-if="isOpen"
        class="fixed start-3 end-3 top-[58px] z-50 flex max-h-[82vh] flex-col overflow-hidden rounded-2xl border border-[var(--line-strong)] bg-[var(--panel)] shadow-[0_24px_64px_rgba(0,0,0,0.65)] backdrop-blur-2xl sm:absolute sm:inset-x-auto sm:start-0 sm:end-auto sm:top-full sm:mt-2 sm:w-96 sm:max-h-[560px]"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between border-b border-[var(--line)] px-4 py-3 bg-[var(--glass)]"
        >
          <div class="flex items-center gap-2">
            <h3 class="text-sm font-extrabold text-[var(--text)]">
              {{ locale.isArabic ? 'الإشعارات' : 'Notifications' }}
            </h3>
            <span
              v-if="notifStore.unreadCount > 0"
              class="rounded-full bg-[#E8A020]/15 px-2 py-0.5 text-[11px] font-bold text-[#E8A020]"
            >
              {{ notifStore.unreadCount }} {{ locale.isArabic ? 'غير مقروءة' : 'unread' }}
            </span>
          </div>
          <div class="flex items-center gap-1.5">
            <button
              v-if="notifStore.unreadCount > 0"
              type="button"
              class="inline-flex items-center gap-1 text-[11px] font-semibold text-[#E8A020] transition hover:text-[#F5C060]"
              :title="locale.isArabic ? 'تحديد الكل كمقروء' : 'Mark all as read'"
              @click="handleMarkAll"
            >
              <CheckCheck :size="13" />
              <span>{{ locale.isArabic ? 'قراءة الكل' : 'Mark all' }}</span>
            </button>
            <button
              type="button"
              class="grid h-6 w-6 place-items-center rounded-lg text-[var(--muted)] hover:bg-[var(--glass-strong)] hover:text-[var(--text)]"
              :aria-label="locale.isArabic ? 'إغلاق' : 'Close'"
              @click="isOpen = false"
            >
              <X :size="13" />
            </button>
          </div>
        </div>

        <!-- Filter Tabs -->
        <div
          class="flex border-b border-[var(--line)] bg-[var(--glass)] px-4 py-1.5 gap-2 text-[11px]"
        >
          <button
            type="button"
            class="rounded-lg px-2.5 py-1 font-bold transition"
            :class="
              filterTab === 'all'
                ? 'bg-[var(--panel)] text-[#E8A020] shadow-sm'
                : 'text-[var(--muted)] hover:text-[var(--text)]'
            "
            @click="filterTab = 'all'"
          >
            {{
              locale.isArabic
                ? `الكل (${notifStore.list.length})`
                : `All (${notifStore.list.length})`
            }}
          </button>
          <button
            type="button"
            class="rounded-lg px-2.5 py-1 font-bold transition"
            :class="
              filterTab === 'unread'
                ? 'bg-[var(--panel)] text-[#E8A020] shadow-sm'
                : 'text-[var(--muted)] hover:text-[var(--text)]'
            "
            @click="filterTab = 'unread'"
          >
            {{
              locale.isArabic
                ? `غير المقروءة (${notifStore.unreadCount})`
                : `Unread (${notifStore.unreadCount})`
            }}
          </button>
        </div>

        <!-- Notifications List -->
        <div class="max-h-80 overflow-y-auto divide-y divide-[var(--line)]">
          <div
            v-if="filteredList.length === 0"
            class="py-8 text-center text-xs text-[var(--muted)]"
          >
            {{ locale.isArabic ? 'لا توجد إشعارات حالياً' : 'No notifications currently' }}
          </div>

          <div
            v-for="item in filteredList"
            :key="item.id"
            class="group relative flex cursor-pointer items-start gap-3 p-3.5 transition hover:bg-[var(--glass-strong)]"
            :class="{ 'bg-[#E8A020]/[0.04]': !item.isRead }"
            @click="handleItemClick(item)"
          >
            <!-- Type Icon -->
            <div class="mt-0.5 shrink-0">
              <span
                v-if="item.type === 'order'"
                class="grid h-8 w-8 place-items-center rounded-xl bg-amber-500/15 text-amber-500"
              >
                <Package :size="16" />
              </span>
              <span
                v-else-if="item.type === 'discount'"
                class="grid h-8 w-8 place-items-center rounded-xl bg-emerald-500/15 text-emerald-500"
              >
                <Percent :size="16" />
              </span>
              <span
                v-else-if="item.type === 'maintenance'"
                class="grid h-8 w-8 place-items-center rounded-xl bg-sky-500/15 text-sky-500"
              >
                <ShieldCheck :size="16" />
              </span>
              <span
                v-else
                class="grid h-8 w-8 place-items-center rounded-xl bg-purple-500/15 text-purple-400"
              >
                <Store :size="16" />
              </span>
            </div>

            <!-- Content -->
            <div class="min-w-0 flex-1 text-start">
              <div class="flex items-center justify-between gap-1">
                <h4
                  class="text-[12px] font-bold leading-snug text-[var(--text)] line-clamp-1"
                  :class="{ 'text-[#E8A020]': !item.isRead }"
                >
                  {{ item.title }}
                </h4>
                <span class="text-[11px] text-[var(--muted)] shrink-0">{{ item.timestamp }}</span>
              </div>
              <p class="mt-1 text-[11px] leading-relaxed text-[var(--muted)] line-clamp-2">
                {{ item.message }}
              </p>
            </div>

            <!-- Read Dot & Delete button -->
            <div class="flex flex-col items-center justify-between self-stretch shrink-0">
              <span
                v-if="!item.isRead"
                class="h-2 w-2 rounded-full bg-[#E8A020] shadow-[0_0_6px_#E8A020]"
                :title="locale.isArabic ? 'غير مقروء' : 'Unread'"
              ></span>
              <button
                type="button"
                :aria-label="locale.isArabic ? 'حذف الإشعار' : 'Delete notification'"
                :title="locale.isArabic ? 'حذف الإشعار' : 'Delete notification'"
                class="opacity-0 group-hover:opacity-100 mt-auto rounded p-1 text-[var(--muted)] hover:text-red-400 transition"
                @click="handleDelete(item.id, $event)"
              >
                <Trash2 :size="12" />
              </button>
            </div>
          </div>
        </div>

        <!-- Footer: Full Path to Notifications -->
        <div class="border-t border-[var(--line)] bg-[var(--glass)] p-2.5">
          <button
            type="button"
            class="flex w-full items-center justify-center gap-1.5 rounded-xl border border-[var(--line)] bg-[var(--panel)] py-2 text-center text-xs font-bold text-[var(--text)] transition hover:border-[#E8A020]/50 hover:text-[#E8A020]"
            @click="goToFullNotifications"
          >
            <span>{{
              locale.isArabic
                ? 'عرض كل الإشعارات وإعدادات التنبيهات'
                : 'View all notifications & settings'
            }}</span>
            <ChevronLeft :size="14" :class="{ 'rotate-180': locale.isEnglish }" />
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.notif-pop-enter-active,
.notif-pop-leave-active {
  transition:
    opacity 160ms ease,
    transform 160ms ease;
}
.notif-pop-enter-from,
.notif-pop-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.97);
}
</style>
