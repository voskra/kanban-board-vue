<script setup lang="ts">
import Icon from '@/components/AppIcon/AppIcon.vue'
import styles from './AppButton.module.scss'
import type { IconColor } from '@/types/icon.ts'

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
    :class="[styles.root, styles[type ?? 'outline'], $attrs.class]"
    :disabled="disabled"
    v-bind="$attrs"
    @click="$emit('click')"
  >
    <Icon v-if="icon" :key="icon" :name="icon" :color="iconColor" />

    <span v-if="text">{{ text }}</span>

    <slot />
  </button>
</template>
