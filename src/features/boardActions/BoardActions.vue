<script setup lang="ts">
import Button from '@/components/AppButton/AppButton.vue'
import styles from './BoardActions.module.scss'
import { useBoardStore } from '@/stores/useBoardStore.ts'
import { getDisabledButtonConfig } from '@/utils/buttonConfigs.ts'
import { computed } from 'vue'

const board = useBoardStore()

const disabledButtonConfig = computed(() => {
  return getDisabledButtonConfig(board.globalDisabled, true)
})
</script>

<template>
  <div :class="styles.root">
    <div :class="styles.actions">
      <Button icon="plus" iconColor="blue" @click="board.addColumn"> New Column </Button>
      <Button icon="shuffle" iconColor="purple"> Shuffle Columns </Button>
      <Button icon="shuffle" iconColor="purple"> Shuffle Cards </Button>
      <Button v-bind="disabledButtonConfig" @click="board.toggleGlobalDisabled" />
    </div>
    <div :class="styles.title">Board Actions</div>
  </div>
</template>
