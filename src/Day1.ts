import * as Effect from "effect/Effect"

const parseInput = (input: string) =>
  Effect.gen(function*() {
    const lines = input.split("\n")
    const pairs = yield* Effect.all(
      lines.filter((line) => line).map((line) => {
        const numbers = line.split(" ").filter(Number).map(Number)
        return numbers.length === 2
          ? Effect.succeed(numbers as [number, number])
          : Effect.fail(new Error("Invalid input"))
      })
    )

    const list1: Array<number> = []
    const list2: Array<number> = []
    for (const [left, right] of pairs) {
      list1.push(left)
      list2.push(right)
    }

    return [list1, list2]
  })

export const result = (input: string) =>
  Effect.gen(function*() {
    const [list1, list2] = yield* parseInput(input)
    list1.sort((a, b) => a - b)
    list2.sort((a, b) => a - b)
    return list1.map((left, index) => Math.abs(left - list2[index])).reduce((sum, value) => sum + value, 0)
  })
