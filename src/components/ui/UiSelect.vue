<script setup lang="ts">
import {
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui'
import { Check, ChevronDown, ChevronUp } from 'lucide-vue-next'

export interface SelectOption {
  label: string
  value: string
  disabled?: boolean
}

const props = defineProps<{
  options: (string | SelectOption)[]
  placeholder?: string
  modelValue?: string
  disabled?: boolean
  class?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <SelectRoot
    :model-value="modelValue"
    :disabled="disabled"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <SelectTrigger
      class="flex items-center justify-between outline-none transition disabled:cursor-not-allowed disabled:opacity-50"
      :class="
        props.class ||
        'h-[42px] w-full rounded-[10px] border border-[var(--line)] bg-[var(--input)] px-3 text-[12px] text-[var(--text)] focus:border-[#E8A020] focus:ring-1 focus:ring-[#E8A020]/50'
      "
    >
      <SelectValue :placeholder="placeholder" />
      <ChevronDown class="h-4 w-4 opacity-50" />
    </SelectTrigger>

    <SelectPortal>
      <SelectContent
        class="z-50 relative max-h-96 min-w-[8rem] overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--panel)] text-[var(--text)] shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
        position="popper"
        :side-offset="4"
      >
        <SelectScrollUpButton class="flex cursor-default items-center justify-center py-1">
          <ChevronUp class="h-4 w-4" />
        </SelectScrollUpButton>

        <SelectViewport class="p-1">
          <SelectItem
            v-for="option in options"
            :key="typeof option === 'string' ? option : option.value"
            :value="typeof option === 'string' ? option : option.value"
            :disabled="typeof option === 'object' ? option.disabled : false"
            class="relative flex w-full cursor-default select-none items-center rounded-lg py-1.5 pl-8 pr-2 text-[12px] font-medium outline-none focus:bg-[#E8A020]/15 focus:text-[#E8A020] data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
          >
            <span class="absolute left-2.5 flex h-3.5 w-3.5 items-center justify-center">
              <SelectItemIndicator>
                <Check class="h-3.5 w-3.5" />
              </SelectItemIndicator>
            </span>
            <SelectItemText>{{
              typeof option === 'string' ? option : option.label
            }}</SelectItemText>
          </SelectItem>
        </SelectViewport>

        <SelectScrollDownButton class="flex cursor-default items-center justify-center py-1">
          <ChevronDown class="h-4 w-4" />
        </SelectScrollDownButton>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
