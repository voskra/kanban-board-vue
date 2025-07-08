import type { Column } from '@/types/board.ts'

export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function shuffleColumnsInBoard(columns: Column[]): Column[] {
  return shuffleArray(columns)
}

export function shuffleCardsInColumns(columns: Column[]): Column[] {
  return columns.map((column) => {
    const shuffledCards = shuffleArray(column.cards).map((card, index) => ({
      ...card,
      order: index + 1,
    }))

    return {
      ...column,
      cards: shuffledCards,
    }
  })
}
