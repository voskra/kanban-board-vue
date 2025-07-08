import type { SortOrder } from '@/types/board.ts'

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

export function getDisabledButtonConfig(disabled?: boolean, isGlobal?: boolean) {
  if (disabled) {
    return {
      icon: 'play',
      iconColor: 'green',
      text: isGlobal ? 'Unlock Columns' : 'Unlock Column',
    }
  }

  return {
    icon: 'pause',
    iconColor: 'yellow',
    text: 'Disable Editing',
  }
}
