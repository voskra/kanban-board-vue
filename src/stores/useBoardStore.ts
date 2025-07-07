import type { State } from '@/types/store.ts'
import { defineStore } from "pinia";

const initialState: State = {
    columns: [
        {
            id: 'todo',
            name: 'TODO',
            cards: [],
        },
        {
            id: 'in-progress',
            name: 'In Progress',
            cards: [],
        },
        {
            id: 'done',
            name: 'Done',
            cards: [],
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
            })
        },
        removeColumn(columnId: string) {
            this.columns = this.columns.filter((col) => col.id !== columnId)
        },
    }
})