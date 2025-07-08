import { STORAGE_KEY } from '@/constants.ts'
import type { Column } from '@/types/board.ts'

export function saveColumns(columns: Column[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(columns))
}

export function getColumns(): Column[] | null {
  const saved = localStorage.getItem(STORAGE_KEY)

  if (saved) {
    try {
      return JSON.parse(saved)
    } catch (e) {
      console.error('Failed to load board state:', e)
    }
  }

  return null
}
