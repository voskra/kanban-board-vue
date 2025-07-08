import type { State } from '@/types/store.ts'
import { defineStore } from 'pinia'

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
    removeColumn(columnId: string) {
      this.columns = this.columns.filter((col) => col.id !== columnId)
    },
    toggleDisabled(columnId: string) {
      const findingColumn = this.columns.find((column) => column.id === columnId)
      if (findingColumn) {
        findingColumn.disabled = !findingColumn.disabled
      }
    },
  },
})
