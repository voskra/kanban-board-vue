<script setup lang="ts">
import Button from '@/components/Button/Button.vue'
import Card from '@/features/card/Card.vue'
import { useBoardStore } from '@/stores/useBoardStore.ts'
import type { Column } from '@/types/board.ts'

import styles from './Column.module.scss'

const props = defineProps<{
  column: Column
}>()

const board = useBoardStore()

function removeColumn() {
  const confirmed = confirm(`Are you sure you want to delete column "${props.column.name}"?`)

  if (confirmed) {
    board.removeColumn(props.column.id)
  }
}

function removeCard(id: string) {
  props.column.cards = props.column.cards.filter((card) => card.id !== id)
}

function addCard() {
  props.column.cards.push({
    id: crypto.randomUUID(),
    title: '',
    description: '',
    isNew: true,
  })
}

function toggleDisabled() {
  board.toggleDisabled(props.column.id)
}
</script>

<template>
  <div :class="[styles.root, column.disabled && styles.disabled]">
    <div :class="styles.header">
      <div :class="styles.title">
        <span :class="styles.name">
          {{ column.name || 'Untitled' }}
        </span>
        {{ column.cards.length }}
      </div>
      <div :class="styles.actions">
        <Button
          :icon="column.disabled ? 'play' : 'pause'"
          :iconColor="column.disabled ? 'green' : 'yellow'"
          @click="toggleDisabled"
        >
          {{ column.disabled ? 'Unlock Column' : 'Disable Editing' }}
        </Button>
        <Button icon="minus" @click="removeColumn" :disabled="column.disabled">
          Delete Column
        </Button>
      </div>
    </div>

    <div :class="styles.content">
      <div :class="styles.cards">
        <template v-for="card in column.cards" :key="card.id">
          <Card :card="card" @delete="removeCard" :disabled="column.disabled" />
        </template>
      </div>

      <Button
        icon="plus"
        iconColor="blue"
        type="solid"
        :class="styles.newCardButton"
        @click="addCard"
        :disabled="column.disabled"
      >
        New Card
      </Button>
    </div>

    <div :class="styles.footer">
      <Button icon="sort" iconColor="purple" :disabled="column.disabled"> Sort </Button>
      <Button icon="clear" iconColor="red" :disabled="column.disabled"> Clear All </Button>
    </div>
  </div>
</template>
