import type { State } from '@/types/store.ts'
import { defineStore } from 'pinia'
import type { Card } from '@/types/card.ts'

const initialState: State = {
  columns: [
    {
      id: 'todo',
      name: 'TODO',
      cards: [],
      disabled: false,
    },
    {
      id: 'in-progress',
      name: 'In Progress',
      cards: [],
      disabled: false,
    },
    {
      id: 'done',
      name: 'Done',
      cards: [],
      disabled: false,
    },
  ],
}

export const useBoardStore = defineStore('board', {
  state: (): State => ({
    ...initialState,
  }),
  actions: {
    addColumn(name?: string) {
      this.columns.push({
        id: crypto.randomUUID(),
        name: name ?? '',
        cards: [],
        disabled: false,
      })
    },
    updateCard(updatedCard: Card) {
      const findingColumn = this.columns.find((column) =>
        column.cards.some((card) => card.id === updatedCard.id),
      )
      if (findingColumn) {
        const index = findingColumn.cards.findIndex((card) => card.id === updatedCard.id)
        if (index !== -1) {
          findingColumn.cards[index] = updatedCard
        }
      }
    },
    removeColumn(columnId: string) {
      this.columns = this.columns.filter((col) => col.id !== columnId)
    },
    toggleDisabled(columnId: string) {
      const findingColumn = this.columns.find((column) => column.id === columnId)
      if (findingColumn) {
        findingColumn.disabled = !findingColumn.disabled
      }
    },
    removeCard(cardId: string) {
      const findingColumn = this.columns.find((column) => column.cards.some((c) => c.id === cardId))
      if (findingColumn) {
        findingColumn.cards = findingColumn.cards.filter((card) => card.id !== cardId)
      }
    },
    addCard(columnId: string, card: Card) {
      const findingColumn = this.columns.find((column) => column.id === columnId)
      if (findingColumn) {
        findingColumn.cards.push({...card, id: crypto.randomUUID()})
      }
    },
  },
})
