import { ref } from 'vue'
import { defineStore } from 'pinia'
import { z } from 'zod'
import { readStored, writeStored } from '@/lib/storage'
import type { Order } from '@/types/order'
import type { CartLine, OrderAddress } from '@/types/cart'
import type { Product } from '@/types/product'

const STORAGE_KEY = 'zaytstore-orders'

const productSchema = z.custom<Product>(
  (value) =>
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { id?: unknown }).id === 'string' &&
    typeof (value as { price?: unknown }).price === 'number',
)

const ordersSchema = z.array(
  z.object({
    id: z.string(),
    createdAt: z.string(),
    status: z.enum(['Processing', 'Shipped', 'Delivered']),
    total: z.number().nonnegative(),
    itemCount: z.number().int().nonnegative(),
    address: z.object({
      name: z.string(),
      street: z.string(),
      city: z.string(),
      postalCode: z.string(),
      phone: z.string().optional(),
    }),
    lines: z.array(z.object({ product: productSchema, quantity: z.number().int().positive() })),
  }),
)

/** معرّف طلب عشوائي آمن — مع بديل للمتصفحات/السياقات التي تفتقر إلى crypto.randomUUID */
function randomId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = crypto.getRandomValues(new Uint8Array(10))
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
  }
  return Array.from({ length: 20 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
}

function createOrderId() {
  return `ZYT-${randomId().replace(/-/g, '').slice(0, 10).toUpperCase()}`
}

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref<Order[]>(readStored(STORAGE_KEY, ordersSchema, []))

  function create(lines: CartLine[], address: OrderAddress, total: number) {
    if (!lines.length) throw new Error('Cannot create an order without items')
    const order: Order = {
      id: createOrderId(),
      createdAt: new Date().toISOString(),
      status: 'Processing',
      total,
      itemCount: lines.reduce((sum, line) => sum + line.quantity, 0),
      address,
      lines: lines.map((line) => ({ ...line })),
    }
    orders.value = [order, ...orders.value]
    writeStored(STORAGE_KEY, orders.value)
    return order
  }

  return { orders, create }
})
