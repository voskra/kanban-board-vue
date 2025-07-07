<script setup lang="ts">
import Column from '@/features/column/Column.vue'
import styles from './Board.module.scss'

</script>

<template>
  <div :class="styles.root">
    <Column
        v-for="col in [{id:1, title: 'title', description: 'description'}]"
        :key="col.id"
        :column="col"
    />
  </div>
</template>
