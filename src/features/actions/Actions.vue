<script setup lang="ts">
import Button from '@/components/Button/Button.vue'
import styles from './Actions.module.scss'
</script>

<template>
  <div :class="styles.root">
    <div :class="styles.actions">
      <Button icon="plus" iconColor="blue">
        New Column
      </Button>
      <Button icon="shuffle" iconColor="purple">
        Shuffle Columns
      </Button>
      <Button icon="shuffle" iconColor="purple">
        Shuffle Cards
      </Button>
      <Button icon="play" iconColor="green">
        Enable Editing
      </Button>
    </div>
    <div :class="styles.title">
      Board Actions
    </div>
  </div>
</template>
