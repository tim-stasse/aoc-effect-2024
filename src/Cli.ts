import * as Args from "@effect/cli/Args"
import * as Command from "@effect/cli/Command"
import * as Console from "effect/Console"
import * as Effect from "effect/Effect"
import * as Match from "effect/Match"
import * as Day1 from "./Day1.js"
import * as Day2 from "./Day2.js"
import * as Day3 from "./Day3.js"

const day = Args.integer({ name: "day" })
const part = Args.integer({ name: "part" })
const input = Args.fileText({ name: "input" })
const command = Command.make(
  "aoc",
  { day, part, input },
  ({ day, input: [_, content], part }) =>
    Match.value(day).pipe(
      Match.when(1, () =>
        Match.value(part).pipe(
          Match.when(1, (_) => Day1.part1(content)),
          Match.when(2, (_) => Day1.part2(content)),
          Match.orElse(() => Effect.fail(new Error("Invalid part argument")))
        )),
      Match.when(2, () =>
        Match.value(part).pipe(
          Match.when(1, (_) => Day2.part1(content)),
          Match.when(2, (_) => Day2.part2(content)),
          Match.orElse(() => Effect.fail(new Error("Invalid part argument")))
        )),
      Match.when(3, () =>
        Match.value(part).pipe(
          Match.when(1, (_) => Day3.part1(content)),
          Match.when(2, (_) => Day3.part2(content)),
          Match.orElse(() => Effect.fail(new Error("Invalid part argument")))
        )),
      Match.orElse(() => Effect.fail(new Error("Invalid day argument")))
    ).pipe(Effect.tapBoth({ onFailure: Console.log, onSuccess: Console.log }))
)

export const run = Command.run(command, {
  name: "Advent of Code 2024",
  version: "0.0.0"
})
