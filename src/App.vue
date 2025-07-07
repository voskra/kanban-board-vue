<script setup lang="ts">
import Actions from '@/features/actions/Actions.vue'
import Board from '@/features/board/Board.vue'
import styles from './App.module.scss'
</script>

<template>
  <div :class="styles.root">
    <Board />
    <Actions />
  </div>
</template>
