<script setup lang="ts">
import type { Column } from '@/types/board.ts'

import styles from './Column.module.scss'

const props = defineProps<{
  column: Column
}>()
</script>

<template>
  <div :class="styles.root">
    <div :class="styles.header">
    </div>

    <div :class="styles.content">
    </div>

    <div :class="styles.footer">
    </div>
  </div>
</template>
