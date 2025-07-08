<script setup lang="ts">
import Button from '@/components/Button/Button.vue'
import Card from '@/features/card/Card.vue'
import { useBoardStore } from "@/stores/useBoardStore.ts";
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
  props.column.cards = props.column.cards.filter(card => card.id !== id)
}

function addCard() {
  props.column.cards.push({
    id: crypto.randomUUID(),
    title: '',
    description: '',
    isNew: true,
  })
}
</script>

<template>
  <div :class="styles.root">
    <div :class="styles.header">
      <div :class="styles.title">
        <span :class="styles.name">
          {{ column.name || 'Untitled' }}
        </span>
        {{ column.cards.length }}
      </div>
      <div :class="styles.actions">
        <Button icon="pause" iconColor="yellow">
          Disable Editing
        </Button>
        <Button icon="minus" @click="removeColumn">
          Delete Column
        </Button>
      </div>
    </div>

    <div :class="styles.content">
      <div :class="styles.cards">
        <template v-for="(card) in column.cards" :key="card.id">
          <Card :card="card" @delete="removeCard"/>
        </template>
      </div>

      <Button icon="plus" iconColor="blue" type="solid" :class="styles.newCardButton" @click="addCard">
        New Card
      </Button>
    </div>

    <div :class="styles.footer">
      <Button icon="sort" iconColor="purple">
        Sort
      </Button>
      <Button icon="clear" iconColor="red">
        Clear All
      </Button>
    </div>
  </div>
</template>
