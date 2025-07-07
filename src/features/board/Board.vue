<script setup lang="ts">
import Column from '@/features/column/Column.vue'
import styles from './Board.module.scss'
import { useBoardStore } from "@/stores/useBoardStore.ts";

const board = useBoardStore()
</script>

<template>
  <div :class="styles.root">
    <Column
        v-for="col in board.columns"
        :key="col.id"
        :column="col"
    />
  </div>
</template>
