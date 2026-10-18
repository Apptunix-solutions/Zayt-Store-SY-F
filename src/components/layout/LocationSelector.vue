<script setup lang="ts">
import { ref } from 'vue'
import { Check, ChevronDown, MapPin, Phone } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useClickOutside } from '@/composables/useClickOutside'
import { toast } from '@/lib/toast'

import { syrianGovernorates } from '@/data/governorates'

const auth = useAuthStore()
const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const cities = syrianGovernorates.map((g) => g.nameAr)

useClickOutside(dropdownRef, () => {
  isOpen.value = false
})

function selectCity(city: string) {
  auth.setLocation(city)
  isOpen.value = false
  toast.success('تم تغيير موقع التوصيل', `الموقع الحالي: ${city}، سوريا`)
}
</script>

<template>
  <div class="flex items-center gap-3" dir="rtl">
    <!-- رقم الهاتف والدعم -->
    <a
      :href="'tel:' + auth.supportPhone.replace(/\s+/g, '')"
      class="group hidden items-center gap-1.5 rounded-lg border border-[var(--line)] bg-[var(--glass)] px-2.5 py-1 text-[11px] font-semibold text-[var(--muted)] transition hover:border-[#E8A020]/40 hover:text-[#E8A020] sm:inline-flex"
      title="اتصل بالدعم الفني والمبيعات"
    >
      <Phone :size="12" class="text-[#E8A020] transition group-hover:scale-110" />
      <span dir="ltr" class="font-mono">{{ auth.supportPhone }}</span>
    </a>

    <!-- محدد وتغيير الموقع -->
    <div ref="dropdownRef" class="relative">
      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-lg border border-[var(--line)] bg-[var(--glass)] px-2.5 py-1 text-[11px] font-semibold text-[var(--muted)] transition hover:border-[#E8A020]/40 hover:text-[var(--text)]"
        :aria-expanded="isOpen"
        aria-label="تغيير المحافظة / الموقع"
        @click="isOpen = !isOpen"
      >
        <MapPin :size="12" class="text-[#E8A020]" />
        <span class="font-bold text-[var(--text)]">{{ auth.selectedLocation }}</span>
        <span class="text-[11px] text-[var(--muted)]">· سوريا</span>
        <ChevronDown
          :size="12"
          class="text-[var(--muted)] transition-transform duration-200"
          :class="{ 'rotate-180': isOpen }"
        />
      </button>

      <!-- Dropdown قائمة المحافظات السورية -->
      <Transition name="drop">
        <div
          v-if="isOpen"
          class="absolute start-0 sm:start-auto sm:end-0 top-full z-50 mt-1.5 w-56 overflow-hidden rounded-2xl border border-[var(--line-strong)] bg-[var(--panel)] p-2 shadow-[0_16px_40px_rgba(0,0,0,0.4)] backdrop-blur-2xl"
        >
          <div class="px-2.5 py-2 border-b border-[var(--line)]">
            <p class="text-[11px] font-bold text-[var(--text)]">اختر مدينة التوصيل</p>
            <p class="text-[11px] text-[var(--muted)]">لعرض أسعار التوصيل والتجار الأقرب إليك</p>
          </div>

          <div class="max-h-56 overflow-y-auto py-1">
            <button
              v-for="city in cities"
              :key="city"
              type="button"
              class="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-right text-[12px] font-medium transition hover:bg-[var(--glass-strong)]"
              :class="
                auth.selectedLocation === city
                  ? 'bg-[#E8A020]/15 font-bold text-[#E8A020]'
                  : 'text-[var(--text)]'
              "
              @click="selectCity(city)"
            >
              <span>{{ city }}</span>
              <Check v-if="auth.selectedLocation === city" :size="14" class="text-[#E8A020]" />
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.drop-enter-active,
.drop-leave-active {
  transition:
    opacity 160ms ease,
    transform 160ms ease;
}
.drop-enter-from,
.drop-leave-to {
  opacity: 0;
  transform: translateY(6px) scale(0.97);
}
</style>
