<script setup lang="ts">
import Button from '@/components/AppButton/AppButton.vue'
import Card from '@/features/boardCard/BoardCard.vue'
import { useBoardStore } from '@/stores/useBoardStore.ts'
import type { Column } from '@/types/board.ts'
import type { Card as CardType } from '@/types/card.ts'

import styles from './BoardColumn.module.scss'
import { computed, nextTick, ref } from 'vue'
import { getNextSortOrder, sortCardsByOrder, sortCardsByTitle } from '@/utils/sorting.ts'
import { getDisabledButtonConfig, getSortButtonConfig } from '@/utils/buttonConfigs.ts'
import { calculateDropIndex, moveCard } from '@/utils/dragAndDrop.ts'

const props = defineProps<{
  column: Column
}>()

const editingTitle = ref(false)
const titleRef = ref<HTMLElement | null>(null)
const editedTitle = ref(props.column.name)

const creatingCard = ref(false)

const isDraggingOverColumn = ref(false)
const dropIndex = ref<number | null>(null)
const cardListRef = ref<HTMLElement | null>(null)

const disabledButtonConfig = computed(() => {
  return getDisabledButtonConfig(props.column.disabled)
})

const sortButtonConfig = computed(() => {
  return getSortButtonConfig(props.column.sort)
})

const sortedCards = computed(() => {
  if (props.column.sort !== 'none') {
    return sortCardsByTitle(props.column.cards, props.column.sort)
  }

  return sortCardsByOrder(props.column.cards)
})

const board = useBoardStore()

function startEditingTitle() {
  if (props.column.disabled) return
  editingTitle.value = true
  editedTitle.value = props.column.name

  nextTick(() => {
    titleRef.value?.focus()

    const range = document.createRange()
    range.selectNodeContents(titleRef.value!)
    const selection = window.getSelection()
    selection?.removeAllRanges()
    selection?.addRange(range)
  })
}

function saveTitle() {
  const trimmedTitle = (titleRef.value?.innerText ?? '').trim()
  if (trimmedTitle && trimmedTitle !== props.column.name) {
    board.updateColumnName(props.column.id, trimmedTitle)
  }
  editingTitle.value = false
}

function cancelEditingTitle() {
  editedTitle.value = props.column.name
  editingTitle.value = false
}

function onTitleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault()
    saveTitle()
  }
  if (e.key === 'Escape') {
    e.preventDefault()
    cancelEditingTitle()
  }
}

function removeColumn() {
  const confirmed = confirm(`Are you sure you want to delete column "${props.column.name}"?`)

  if (confirmed) {
    board.removeColumn(props.column.id)
  }
}

function addCard() {
  if (creatingCard.value) {
    return
  }

  creatingCard.value = true
}

function onCardSaved(newCard: CardType) {
  board.addCard(props.column.id, newCard)
  creatingCard.value = false
}

function onCardUpdated(updatedCard: CardType) {
  board.updateCard(updatedCard)
}

function onCardCancelled() {
  creatingCard.value = false
}

function onCardDelete(cardId: string) {
  board.removeCard(cardId)
}

function toggleDisabled() {
  onCardCancelled()
  board.toggleColumnDisabled(props.column.id)
}

function toggleSort() {
  const nextSort = getNextSortOrder(props.column.sort)

  if (nextSort === 'none') {
    board.clearColumnSort(props.column.id)
  } else {
    board.sortColumnCards(props.column.id, nextSort)
  }
}

function clearAllCards() {
  const confirmed = confirm(
    `Are you sure you want to delete all cards in column "${props.column.name}"?`,
  )

  if (confirmed) {
    board.removeAllCards(props.column.id)
  }
}

function onDragEnter() {
  if (board.draggedCard) {
    isDraggingOverColumn.value = true
  }
}

function onDragOver(event: DragEvent) {
  if (board.draggedCard) {
    isDraggingOverColumn.value = true
    dropIndex.value = calculateDropIndex(event, cardListRef.value!)
  }
}

function onDrop() {
  if (board.draggedCard && dropIndex.value !== null) {
    board.columns = moveCard(board.columns, board.draggedCard, props.column.id, dropIndex.value)

    board.setDraggedCard(null)
    dropIndex.value = null
    isDraggingOverColumn.value = false
  }
}

function onDragLeave(event: DragEvent) {
  const relatedTarget = event.relatedTarget as HTMLElement | null

  if (relatedTarget && cardListRef.value && cardListRef.value.contains(relatedTarget)) {
    return
  }

  isDraggingOverColumn.value = false
  dropIndex.value = null
}
</script>

<template>
  <div
    :class="[styles.root, column.disabled && styles.disabled]"
    @dragenter="onDragEnter"
    @dragover.prevent="onDragOver"
    @drop="onDrop"
    @dragleave="onDragLeave"
  >
    <div :class="styles.header">
      <div :class="styles.title">
        <span
          ref="titleRef"
          :class="styles.name"
          :contenteditable="editingTitle"
          @dblclick="startEditingTitle"
          @keydown="onTitleKeydown"
          @blur="saveTitle"
        >
          {{ column.name || 'Untitled' }}
        </span>
        {{ column.cards.length }}
      </div>
      <div :class="styles.actions">
        <Button v-bind="disabledButtonConfig" @click="toggleDisabled" />
        <Button icon="minus" @click="removeColumn" :disabled="column.disabled">
          Delete Column
        </Button>
      </div>
    </div>

    <div :class="styles.content">
      <div :class="styles.cards" ref="cardListRef">
        <template v-for="(card, index) in sortedCards" :key="card.id">
          <div
            data-drop-zone
            :class="[styles.dropZone, dropIndex === index && styles.active]"
          ></div>

          <Card
            :card="card"
            @delete="onCardDelete"
            :disabled="column.disabled"
            @save="onCardUpdated"
          />
        </template>

        <div
          data-drop-zone
          :class="[styles.dropZone, dropIndex === column.cards.length && styles.active]"
        ></div>

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
      <Button
        :class="styles.sortButton"
        :icon="sortButtonConfig.icon"
        iconColor="purple"
        :disabled="column.disabled || column.cards.length <= 1"
        @click="toggleSort"
      >
        <span :class="styles.sortButtonPrefix">Sort</span> {{ sortButtonConfig.postfix }}
      </Button>
      <Button
        icon="clear"
        iconColor="red"
        :disabled="column.disabled || !column.cards.length"
        @click="clearAllCards"
      >
        Clear All
      </Button>
    </div>
  </div>
</template>
