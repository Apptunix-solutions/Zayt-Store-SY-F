import { onBeforeUnmount, onMounted, type Ref } from 'vue'

/**
 * يغلق القائمة المنسدلة عند النقر خارجها.
 *
 * يجمع منطق التطبيقات الثلاثة (قائمة المستخدم، الإشعارات، محدد الموقع) في
 * مكان واحد بدل تكرار مستمع `mousedown` ودورة حياته في كل مكوّن.
 */
export function useClickOutside(target: Ref<HTMLElement | null>, onOutside: () => void) {
  function handler(event: MouseEvent) {
    const el = target.value
    if (el && !el.contains(event.target as Node)) onOutside()
  }

  onMounted(() => document.addEventListener('mousedown', handler))
  onBeforeUnmount(() => document.removeEventListener('mousedown', handler))
}
