import type { Column } from '@/types/board.ts'
import type { Card } from '@/types/card.ts'

export interface State {
  columns: Column[]
  globalDisabled: boolean
  draggedCard: Card | null
}
