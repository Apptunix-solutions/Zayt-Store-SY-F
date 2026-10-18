<script setup lang="ts">
import { formatPrice } from '@/lib/utils'
import { readStoredJson, writeRaw, removeRaw } from '@/lib/storage'
import { computed, ref } from 'vue'
import { ArrowRight, Clock3, Search, X } from 'lucide-vue-next'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { products } from '@/data/products'

const route = useRoute()
const router = useRouter()
/** البدء بكلمة البحث القادمة من الرابط ‎/search?q=‎ مباشرة */
const query = ref(String(route.query.q ?? ''))
// قراءة آمنة: مصفوفة بحث تالفة في التخزين لا تُسقط الصفحة.
const recent = ref<string[]>(
  readStoredJson<string[]>(
    'zaytstore-recent-searches',
    ['زيت رانيول', '5W-30', 'زيت لومو'],
    (value) => Array.isArray(value) && value.every((item) => typeof item === 'string'),
  ),
)
const results = computed(() =>
  query.value.length > 1
    ? products.filter((product) =>
        `${product.name} ${product.brand} ${product.merchantName} ${product.tags.join(' ')}`
          .toLowerCase()
          .includes(query.value.toLowerCase()),
      )
    : [],
)
function useRecent(value: string) {
  query.value = value
}
function clearRecent() {
  recent.value = []
  removeRaw('zaytstore-recent-searches')
}
function openShop() {
  const value = query.value.trim()
  if (!value) return
  recent.value = [
    value,
    ...recent.value.filter((item) => item.toLowerCase() !== value.toLowerCase()),
  ].slice(0, 6)
  writeRaw('zaytstore-recent-searches', JSON.stringify(recent.value))
  router.push({ path: '/search', query: { q: value } })
}
</script>

<template>
  <div class="mx-auto max-w-3xl pb-12 pt-8 sm:pt-14">
    <RouterLink
      to="/"
      class="inline-flex items-center gap-2 text-xs font-semibold text-[var(--muted)] hover:text-[var(--text)]"
      ><ArrowRight :size="15" /> الرئيسية</RouterLink
    >
    <div class="mt-12 text-center">
      <p class="text-[12px] font-bold uppercase text-[#E8A020]">ابحث في ZaytStore</p>
      <h1 class="display-font mt-2 text-4xl font-bold text-[var(--text)]">
        ما الذي تبحث عنه<span class="text-[#E8A020]">؟</span>
      </h1>
    </div>
    <form
      class="group relative mt-9 flex items-center gap-2 rounded-2xl border border-[var(--line)] bg-[var(--panel)]/95 p-2 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-[var(--line-strong)] hover:shadow-md focus-within:border-[#E8A020] focus-within:ring-4 focus-within:ring-[#E8A020]/15 focus-within:shadow-[0_8px_30px_rgba(232,160,32,0.12)]"
      @submit.prevent="openShop"
    >
      <div
        class="pointer-events-none flex shrink-0 items-center justify-center ps-3 text-[var(--muted)] transition-colors duration-200 group-focus-within:text-[#E8A020]"
        aria-hidden="true"
      >
        <Search :size="20" class="stroke-[2.2]" />
      </div>
      <label class="sr-only" for="search-page-input">ابحث في المنتجات</label>
      <input
        id="search-page-input"
        v-model="query"
        autofocus
        type="search"
        placeholder="جرّب «5W-30» أو «رانيول» أو «مصافي»…"
        class="h-12 min-w-0 flex-1 bg-transparent px-2.5 text-sm sm:text-base font-medium text-[var(--text)] outline-none placeholder:text-[var(--muted)]"
      />
      <button
        v-if="query"
        type="button"
        aria-label="مسح البحث"
        class="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[var(--muted)] transition-colors hover:bg-[var(--glass)] hover:text-[var(--text)]"
        @click="query = ''"
      >
        <X :size="16" />
      </button>
      <button
        type="submit"
        class="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#E8A020] to-[#f5ab2d] px-6 text-sm font-bold text-[#071F0D] shadow-[0_4px_14px_rgba(232,160,32,0.30)] transition-all duration-200 hover:-translate-y-0.5 hover:from-[#f5ab2d] hover:to-[#ffb738] hover:shadow-[0_6px_22px_rgba(232,160,32,0.45)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8A020] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--panel)]"
      >
        <Search :size="16" class="shrink-0 stroke-[2.5]" />
        <span>بحث</span>
      </button>
    </form>
    <div v-if="!query" class="mt-8">
      <div class="flex items-center justify-between">
        <p class="text-[12px] font-bold uppercase text-[var(--muted)]">عمليات بحث سابقة</p>
        <button
          v-if="recent.length"
          class="text-[12px] text-[var(--muted)] hover:text-[var(--text)]"
          @click="clearRecent"
        >
          مسح
        </button>
      </div>
      <div class="mt-4 space-y-2">
        <button
          v-for="item in recent"
          :key="item"
          class="flex w-full items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--panel)] px-4 py-3 text-right text-xs text-[var(--soft)] hover:border-[var(--line-strong)] hover:text-[var(--text)]"
          @click="useRecent(item)"
        >
          <Clock3 :size="15" class="text-[var(--muted)]" />{{ item }}
        </button>
      </div>
    </div>
    <div v-else class="mt-8">
      <div v-if="results.length" class="space-y-2">
        <button
          v-for="product in results"
          :key="product.id"
          class="flex w-full items-center gap-4 rounded-xl border border-[var(--line)] bg-[var(--panel)] p-3 text-right hover:border-[#E8A020]/40"
          @click="router.push(`/product/${product.slug}`)"
        >
          <img
            :src="product.image"
            :alt="product.name"
            class="h-12 w-12 rounded-lg bg-[var(--elevated)] object-contain p-1"
          /><span class="flex-1"
            ><strong class="block text-sm text-[var(--text)]">{{ product.name }}</strong
            ><span class="mt-1 block text-[12px] text-[var(--muted)]"
              >{{ product.brand }} · {{ product.merchantName }}</span
            ></span
          ><span class="text-sm font-bold text-[var(--text)]">{{
            formatPrice(product.price)
          }}</span>
        </button>
      </div>
      <div v-else class="py-12 text-center">
        <p class="text-sm text-[var(--muted)]">لا توجد نتائج مطابقة بعد.</p>
        <button class="mt-4 text-xs font-bold text-[#E8A020]" @click="openShop">
          تصفّح كل المنتجات
        </button>
      </div>
    </div>
  </div>
</template>
