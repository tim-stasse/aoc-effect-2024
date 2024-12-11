import * as Effect from "effect/Effect"

const getResult = (input: string) => {
  let result = 0
  for (const match of input.matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g)) {
    result += Number.parseInt(match[1], 10) * Number.parseInt(match[2], 10)
  }
  return Effect.succeed(result)
}

export const part1 = getResult

const removeDisabledBits = (input: string) => {
  return input.split("don't()").map((value, index) => {
    if (index === 0) return value
    const dos = value.split("do()")
    if (dos.length > 1) {
      dos.shift()
      return dos.join("")
    }
    return ""
  }).join("")
}

export const part2 = (input: string) => {
  const withRemovedBits = removeDisabledBits(input)
  return getResult(withRemovedBits)
}
