import type { Card } from '@/types/card.ts'

export type SortOrder = 'none' | 'asc' | 'desc'

export interface Column {
  id: string
  name: string
  cards: Card[]
  disabled: boolean
  sort: SortOrder
}
