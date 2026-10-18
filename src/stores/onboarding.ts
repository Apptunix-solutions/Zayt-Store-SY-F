import { ref } from 'vue'
import { defineStore } from 'pinia'
import { readRaw, writeRaw } from '@/lib/storage'

export const useOnboardingStore = defineStore('onboarding', () => {
  const complete = ref(readRaw('zaytstore-onboarding-complete') === 'true')

  function finish() {
    complete.value = true
    writeRaw('zaytstore-onboarding-complete', 'true')
  }

  return { complete, finish }
})
