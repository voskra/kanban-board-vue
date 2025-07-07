<script setup lang="ts">
import Button from '@/components/Button/Button.vue'
import Card from '@/features/card/Card.vue'
import type { Column } from '@/types/board.ts'

import styles from './Column.module.scss'

const props = defineProps<{
  column: Column
}>()
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
        <Button icon="minus">
          Delete Column
        </Button>
      </div>
    </div>

    <div :class="styles.content">
      <div :class="styles.cards">
        <template v-for="(card) in column.cards" :key="card.id">
          <Card :card="card"/>
        </template>
      </div>

      <Button icon="plus" iconColor="blue" type="solid" :class="styles.newCardButton">
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
