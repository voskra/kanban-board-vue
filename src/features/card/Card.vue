<script setup lang="ts">
import type { Card } from '@/types/card.ts'
import styles from './Card.module.scss'

const props = defineProps<{
  card: Card
}>()
</script>

<template>
  <div :class="styles.root">
    Card
  </div>
</template>
