import type { State } from '@/types/store.ts'
import { defineStore } from 'pinia'
import type { Card } from '@/types/card.ts'
import { sortCardsByOrder, sortCardsByTitle } from '@/utils/sorting.ts'
import { shuffleCardsInColumns, shuffleColumnsInBoard } from '@/utils/shuffle.ts'
import { getColumns } from '@/utils/stateToLocalStorage.ts'

const initialState: State = {
  draggedCard: null,
  globalDisabled: false,
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
  getters: {
    globalDisabled(state): boolean {
      return state.columns.every((col) => col.disabled)
    },
  },
  actions: {
    initializeBoard() {
      const columns = getColumns() ?? initialState.columns

      this.columns = columns.map((column) => ({
        ...column,
        lastEdited: column.lastEdited ? new Date(column.lastEdited) : undefined,
      }))
    },
    addColumn(name?: string) {
      this.columns.push({
        id: crypto.randomUUID(),
        name: name ?? '',
        cards: [],
        disabled: false,
        sort: 'none',
      })
    },
    removeColumn(columnId: string) {
      this.columns = this.columns.filter((column) => column.id !== columnId)
    },
    updateColumnName(columnId: string, name: string) {
      const column = this.columns.find((c) => c.id === columnId)
      if (column) {
        column.name = name
        column.lastEdited = new Date()
      }
    },
    toggleColumnDisabled(columnId: string) {
      const findingColumn = this.columns.find((column) => column.id === columnId)
      if (findingColumn) {
        findingColumn.disabled = !findingColumn.disabled
      }
    },

    toggleGlobalDisabled() {
      const shouldDisableAll = !this.globalDisabled
      this.columns.forEach((col) => {
        col.disabled = shouldDisableAll
      })
    },

    addCard(columnId: string, card: Card) {
      const findingColumn = this.columns.find((column) => column.id === columnId)
      if (findingColumn) {
        const maxOrder = Math.max(0, ...findingColumn.cards.map((card) => card.order))
        card.order = maxOrder + 1
        findingColumn.cards.push({ ...card, id: crypto.randomUUID() })
        findingColumn.lastEdited = new Date()
      }
    },
    updateCard(updatedCard: Card) {
      const findingColumn = this.columns.find((column) =>
        column.cards.some((card) => card.id === updatedCard.id),
      )
      if (findingColumn) {
        const index = findingColumn.cards.findIndex((card) => card.id === updatedCard.id)
        if (index !== -1) {
          findingColumn.cards[index] = updatedCard
          findingColumn.lastEdited = new Date()
        }
      }
    },
    removeCard(cardId: string) {
      const findingColumn = this.columns.find((column) => column.cards.some((c) => c.id === cardId))
      if (findingColumn) {
        findingColumn.cards = findingColumn.cards.filter((card) => card.id !== cardId)
        findingColumn.lastEdited = new Date()
      }
    },
    removeAllCards(columnId: string) {
      const findingColumn = this.columns.find((column) => column.id === columnId)
      if (findingColumn) {
        findingColumn.cards = []
        findingColumn.lastEdited = new Date()
      }
    },

    sortColumnCards(columnId: string, order: 'asc' | 'desc') {
      const findingColumn = this.columns.find((column) => column.id === columnId)
      if (findingColumn) {
        findingColumn.cards = sortCardsByTitle(findingColumn.cards, order)
        findingColumn.sort = order
        findingColumn.lastEdited = new Date()
      }
    },

    clearColumnSort(columnId: string) {
      const findingColumn = this.columns.find((column) => column.id === columnId)
      if (findingColumn) {
        findingColumn.cards = sortCardsByOrder(findingColumn.cards)
        findingColumn.sort = 'none'
        findingColumn.lastEdited = new Date()
      }
    },

    shuffleColumns() {
      this.columns = shuffleColumnsInBoard(this.columns)
    },

    shuffleCards() {
      this.columns = shuffleCardsInColumns(this.columns).map((col) => ({
        ...col,
        lastEdited: new Date(),
      }))
    },

    setDraggedCard(card: Card | null) {
      this.draggedCard = card
    },
  },
})
