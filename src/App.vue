<script setup lang="ts">
import Actions from '@/features/boardActions/BoardActions.vue'
import Board from '@/features/board/BoardContainer.vue'
import styles from './App.module.scss'
</script>

<template>
  <div :class="styles.root">
    <Board />
    <Actions />
  </div>
</template>
