import type { State } from '@/types/store.ts'
import { defineStore } from 'pinia'
import type { Card } from '@/types/card.ts'
import { sortCardsByOrder, sortCardsByTitle } from '@/utils/sorting.ts'

const initialState: State = {
  columns: [
    {
      id: 'todo',
      name: 'TODO',
      cards: [],
      disabled: false,
      sort: 'none',
    },
    {
      id: 'in-progress',
      name: 'In Progress',
      cards: [],
      disabled: false,
      sort: 'none',
    },
    {
      id: 'done',
      name: 'Done',
      cards: [],
      disabled: false,
      sort: 'none',
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
        sort: 'none',
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
      this.columns = this.columns.filter((column) => column.id !== columnId)
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
        const maxOrder = Math.max(0, ...findingColumn.cards.map((card) => card.order))
        card.order = maxOrder + 1
        findingColumn.cards.push({ ...card, id: crypto.randomUUID() })
      }
    },
    removeAllCards(columnId: string) {
      const findingColumn = this.columns.find((column) => column.id === columnId)
      if (findingColumn) {
        findingColumn.cards = []
      }
    },

    sortColumnCards(columnId: string, order: 'asc' | 'desc') {
      const findingColumn = this.columns.find((column) => column.id === columnId)
      if (findingColumn) {
        findingColumn.cards = sortCardsByTitle(findingColumn.cards, order)
        findingColumn.sort = order
      }
    },

    clearColumnSort(columnId: string) {
      const findingColumn = this.columns.find((column) => column.id === columnId)
      if (findingColumn) {
        findingColumn.cards = sortCardsByOrder(findingColumn.cards)
        findingColumn.sort = 'none'
      }
    },
  },
})
