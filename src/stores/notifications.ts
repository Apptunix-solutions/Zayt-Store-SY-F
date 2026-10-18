import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { readStoredJson, writeRaw } from '@/lib/storage'

export interface AppNotification {
  id: string
  title: string
  message: string
  timestamp: string
  isRead: boolean
  type: 'order' | 'discount' | 'maintenance' | 'system'
  link?: string
}

const STORAGE_KEY = 'zaytstore_notifications'

const initialNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'تم تأكيد طلبك #ORD-9824',
    message: 'طلبك لزيت كاسترول إيدج 5W-40 وفلتر بوش قيد التجهيز للتسليم في دمشق.',
    timestamp: 'منذ 10 دقائق',
    isRead: false,
    type: 'order',
    link: '/profile?tab=orders',
  },
  {
    id: 'notif-2',
    title: 'تخفيض 20% على فلاتر المحرك الألمانية',
    message: 'عرض خاص لفترة محدودة على كافة فلاتر MANN و Bosch لدى المتاجر المعتمدة.',
    timestamp: 'منذ ساعتين',
    isRead: false,
    type: 'discount',
    link: '/products',
  },
  {
    id: 'notif-3',
    title: 'تذكير موعد تبديل الزيت الدوري',
    message: 'مر 4,800 كم منذ آخر استبدال لزيت المحرك في كراج سيارتك. احجز فحصك الآن.',
    timestamp: 'منذ يوم',
    isRead: true,
    type: 'maintenance',
    link: '/garage',
  },
  {
    id: 'notif-4',
    title: 'انضمام تاجر معتمد جديد في منطقتك',
    message: 'مركز الشام الدولي لقطع الغيار والزيوت الأصلية متاح الآن في دمشق وحمص.',
    timestamp: 'منذ يومين',
    isRead: true,
    type: 'system',
    link: '/merchants',
  },
]

export const useNotificationsStore = defineStore('notifications', () => {
  // قراءة آمنة: أي مصفوفة مخزَّنة تالفة أو مُعدَّلة تُهمَش بدل إسقاط التطبيق.
  const list = ref<AppNotification[]>(
    readStoredJson<AppNotification[]>(STORAGE_KEY, initialNotifications, Array.isArray),
  )

  const unreadCount = computed(() => list.value.filter((n) => !n.isRead).length)

  function save() {
    writeRaw(STORAGE_KEY, JSON.stringify(list.value))
  }

  function markAsRead(id: string) {
    const item = list.value.find((n) => n.id === id)
    if (item && !item.isRead) {
      item.isRead = true
      save()
    }
  }

  function markAllAsRead() {
    list.value.forEach((n) => (n.isRead = true))
    save()
  }

  function remove(id: string) {
    list.value = list.value.filter((n) => n.id !== id)
    save()
  }

  function clearAll() {
    list.value = []
    save()
  }

  function addNotification(notif: Omit<AppNotification, 'id' | 'isRead'>) {
    list.value.unshift({
      ...notif,
      id: 'notif-' + Date.now().toString(36),
      isRead: false,
    })
    save()
  }

  return {
    list,
    unreadCount,
    markAsRead,
    markAllAsRead,
    remove,
    clearAll,
    addNotification,
  }
})
