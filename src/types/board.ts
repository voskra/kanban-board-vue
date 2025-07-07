import type { Card } from '@/types/card.ts'

export interface Column {
    id: string
    name: string
    cards: Card[]
}