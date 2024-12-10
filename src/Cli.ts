import * as Args from "@effect/cli/Args"
import * as Command from "@effect/cli/Command"
import * as Options from "@effect/cli/Options"
import * as Console from "effect/Console"
import * as Effect from "effect/Effect"
import * as Match from "effect/Match"
import * as Day1 from "./Day1.js"

const day = Args.integer({ name: "day" })
const part = Options.choice("part", ["1", "2"])
const input = Args.fileText({ name: "input" })
const command = Command.make(
  "aoc",
  { day, part, input },
  ({ day, input: [_, content], part }) =>
    Match.value([day, part]).pipe(
      Match.when([1, "1"], (_) => Day1.part1(content)),
      Match.when([1, "2"], (_) => Day1.part2(content)),
      Match.orElse(() => Effect.fail(new Error("Invalid day argument")))
    ).pipe(Effect.tap(Console.log))
)

export const run = Command.run(command, {
  name: "Advent of Code 2024",
  version: "0.0.0"
})
