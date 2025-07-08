<script setup lang="ts">
import Actions from '@/features/boardActions/BoardActions.vue'
import Board from '@/features/board/BoardContainer.vue'
import styles from './App.module.scss'
import { useBoardStore } from '@/stores/useBoardStore.ts'
import { watch } from 'vue'
import { saveColumns } from '@/utils/stateToLocalStorage.ts'

const board = useBoardStore()

watch(
  () => ({
    columns: board.columns,
  }),
  (newState) => {
    saveColumns(newState.columns)
  },
  { deep: true },
)

board.initializeBoard()
</script>

<template>
  <div :class="styles.root">
    <Board />
    <Actions />
  </div>
</template>
