<script setup lang="ts">
import Button from '@/components/Button/Button.vue'
import Card from '@/features/card/Card.vue'
import { useBoardStore } from '@/stores/useBoardStore.ts'
import type { Column } from '@/types/board.ts'
import type { Card as CardType } from '@/types/card.ts'

import styles from './Column.module.scss'
import { ref } from 'vue'

const props = defineProps<{
  column: Column
}>()

const creatingCard = ref(false)

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
  if (creatingCard.value) {
    return
  }

  creatingCard.value = true
}

function onCardSaved(newCard: CardType) {
  props.column.cards.push(newCard)
  creatingCard.value = false
}

function onCardCancelled() {
  creatingCard.value = false
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

        <Card
          v-if="creatingCard"
          :card="{ id: '', title: '', description: '' }"
          :isNew="true"
          @save="onCardSaved"
          @cancel="onCardCancelled"
        />
      </div>

      <Button
        icon="plus"
        iconColor="blue"
        type="solid"
        :class="styles.newCardButton"
        @click="addCard"
        :disabled="column.disabled || creatingCard"
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
