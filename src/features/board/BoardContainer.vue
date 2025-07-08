<script setup lang="ts">
import Column from '@/features/boardColumn/BoardColumn.vue'
import styles from './BoardContainer.module.scss'
import { useBoardStore } from '@/stores/useBoardStore.ts'

const board = useBoardStore()
</script>

<template>
  <div :class="styles.root">
    <Column v-for="col in board.columns" :key="col.id" :column="col" />
  </div>
</template>
