<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import styles from './Icon.module.scss'
import type { IconColor } from "@/types/icon.ts";

const props = defineProps<{
  name: string
  color?: IconColor
}>()

const iconComponent = defineAsyncComponent(() => {
  console.log(props.name, props.color)
  return import(`@/assets/icons/${props.name}.svg`)
})
</script>

<template>
  <component
      :is="iconComponent"
      :class="[styles.root, styles[props.color ?? 'black']]"
  />
</template>
