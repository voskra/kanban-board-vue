<script setup lang="ts">
import Icon from '@/components/Icon/Icon.vue'
import styles from './Button.module.scss'
import type { IconColor } from "@/types/icon.ts"

defineProps<{
  text?: string
  disabled?: boolean
  type?: 'solid' | 'outline' | 'ghost'
  icon?: string
  iconColor?: IconColor
}>()

defineEmits<{
  (e: 'click'): void
}>()
</script>

<template>
  <button
      :class="[styles.root, styles[type ?? 'outline']]"
      :disabled="disabled"
      v-bind="$attrs"
      @click="$emit('click')"
  >
    <Icon v-if="icon" :name="icon" :color="iconColor" />

    <span v-if="text">{{ text }}</span>

    <slot />
  </button>
</template>