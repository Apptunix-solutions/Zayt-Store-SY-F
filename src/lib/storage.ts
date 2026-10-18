import type { z } from 'zod'

export function readStored<T>(key: string, schema: z.ZodType<T>, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    const result = schema.safeParse(JSON.parse(raw))
    if (result.success) return result.data
    localStorage.removeItem(key)
  } catch {
    // Corrupt JSON or storage blocked (e.g. Safari private mode): start fresh.
    removeStored(key)
  }
  return fallback
}

/**
 * يقرأ قيمة JSON من التخزين بأمان: أي بيانات تالفة أو مُعدَّلة أو غير مطابقة
 * للشكل المتوقّع تُهمَش ويعاد المفتاح، بدل إسقاط التطبيق عند الإقلاع.
 */
export function readStoredJson<T>(
  key: string,
  fallback: T,
  validate?: (value: unknown) => boolean,
): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    const parsed: unknown = JSON.parse(raw)
    if (validate && !validate(parsed)) {
      removeStored(key)
      return fallback
    }
    return parsed as T
  } catch {
    removeStored(key)
    return fallback
  }
}

export function writeStored(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Quota exceeded or storage blocked; keep in-memory state only.
  }
}

export function removeStored(key: string) {
  try {
    localStorage.removeItem(key)
  } catch {
    // Storage unavailable.
  }
}

/**
 * نسخ الخام الآمنة من واجهة التخزين: عند حجب التخزين (وضع التصفح الخاص في
 * Safari أو داخل صفحات ويب مضمّنة) تُعيد null/no-op بدل إسقاط التطبيق.
 */
export function readRaw(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export function writeRaw(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Quota exceeded or storage blocked; keep in-memory state only.
  }
}

export function removeRaw(key: string) {
  try {
    localStorage.removeItem(key)
  } catch {
    // Storage unavailable.
  }
}
