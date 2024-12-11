import * as Effect from "effect/Effect"

export const part1 = (input: string) => {
  let result = 0
  for (const match of input.matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g)) {
    result += Number.parseInt(match[1], 10) * Number.parseInt(match[2], 10)
  }
  return Effect.succeed(result)
}
