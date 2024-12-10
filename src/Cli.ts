import * as Args from "@effect/cli/Args"
import * as Command from "@effect/cli/Command"
import * as Console from "effect/Console"
import * as Effect from "effect/Effect"
import * as Match from "effect/Match"
import * as Day1 from "./Day1.js"

const day = Args.integer({ name: "day" })
const input = Args.fileText({ name: "input" })
const command = Command.make(
  "aoc",
  { day, input },
  ({ day, input: [_, content] }) =>
    Match.value(day).pipe(
      Match.when(1, (_) => Day1.result(content)),
      Match.orElse(() => Effect.fail(new Error("Invalid day argument")))
    ).pipe(Effect.tap(Console.log))
)

export const run = Command.run(command, {
  name: "Advent of Code 2024",
  version: "0.0.0"
})
