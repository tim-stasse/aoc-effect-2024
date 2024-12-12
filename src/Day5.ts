import * as Effect from "effect/Effect"

class PageOrderingRules {
  rules: Array<[number, number]>

  constructor(rules: Array<[number, number]>) {
    this.rules = rules
  }

  getApplicable(update: PrintingUpdate) {
    return this.rules.filter(([left, right]) => update.pages.includes(left) && update.pages.includes(right))
  }
}

class PrintingUpdate {
  pages: Array<number>

  constructor(pages: Array<number>) {
    this.pages = pages
  }

  isCorrectlyOrdered(rules: Array<[number, number]>) {
    for (const [left, right] of rules) {
      const leftIndex = this.pages.indexOf(left)
      const rightIndex = this.pages.indexOf(right)
      if (leftIndex > rightIndex) {
        return false
      }
    }
    return true
  }

  get middlePage() {
    return this.pages[Math.round(this.pages.length / 2) - 1]
  }
}

const parseInput = (input: string) => {
  const lines = input.trimEnd().split("\n")
  const separatorIndex = lines.indexOf("")
  return {
    rules: new PageOrderingRules(
      lines.slice(0, separatorIndex).map((line) => line.split("|").map(Number)).map(([left, right]) => [left, right])
    ),
    updates: lines.slice(separatorIndex + 1).map((line) => new PrintingUpdate(line.split(",").map(Number)))
  }
}

export const part1 = (input: string) => {
  const { rules, updates } = parseInput(input)
  const correctlyOrderedUpdates = updates.filter((update) => update.isCorrectlyOrdered(rules.getApplicable(update)))
  const middlePages = correctlyOrderedUpdates.map((update) => update.middlePage)
  return Effect.succeed(middlePages.reduce((sum, value) => sum + value, 0))
}

export const part2 = (_input: string) => {
  return Effect.succeed(0)
}
