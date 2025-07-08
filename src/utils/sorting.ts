import type { Card } from '@/types/card.ts'
import type { SortOrder } from '@/types/board.ts'

export function sortCardsByTitle(cards: Card[], order: SortOrder): Card[] {
  if (order === 'asc') {
    return [...cards].sort((a, b) => a.title.localeCompare(b.title))
  }
  if (order === 'desc') {
    return [...cards].sort((a, b) => b.title.localeCompare(a.title))
  }
  return cards
}

export function getNextSortOrder(current: SortOrder): SortOrder {
  if (current === 'none') return 'asc'
  if (current === 'asc') return 'desc'
  return 'none'
}

export function sortCardsByOrder(cards: Card[]): Card[] {
  return [...cards].sort((a, b) => a.order - b.order)
}

export function getSortButtonConfig(order: SortOrder) {
  switch (order) {
    case 'asc':
      return {
        icon: 'sortAsc',
        postfix: 'Ascending',
      }
    case 'desc':
      return {
        icon: 'sortDesc',
        postfix: 'Descending',
      }
    default:
      return {
        icon: 'sort',
        postfix: '',
      }
  }
}
