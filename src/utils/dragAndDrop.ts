import type { Column } from '@/types/board.ts'
import type { Card } from '@/types/card.ts'

export function calculateDropIndex(event: DragEvent, container: HTMLElement): number {
  const cardElements = Array.from(container.children).filter(
    (element) => !element.hasAttribute('data-drop-zone'),
  )

  let newIndex = cardElements.length

  for (let i = 0; i < cardElements.length; i++) {
    const element = cardElements[i] as HTMLElement
    const rect = element.getBoundingClientRect()
    const offset = event.clientY - rect.top

    if (offset < rect.height / 2) {
      newIndex = i
      break
    }
  }

  return newIndex
}

export function moveCard(
  columns: Column[],
  movingCard: Card,
  targetColumnId: string,
  targetIndex: number,
): Column[] {
  const updatedColumns = columns.map((column) => {
    const filteredCards = column.cards.filter((card) => card.id !== movingCard.id)
    return { ...column, cards: filteredCards }
  })

  return updatedColumns.map((column) => {
    if (column.id === targetColumnId) {
      const newCards = [...column.cards]
      newCards.splice(targetIndex, 0, movingCard)

      const reordered = newCards.map((card, index) => ({
        ...card,
        order: index + 1,
      }))

      return { ...column, cards: reordered }
    }
    return column
  })
}
