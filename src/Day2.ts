import * as Effect from "effect/Effect"

class ReactorSafetyReport {
  static MinimumSafeDifference = 1
  static MaximumSafeDifference = 3

  static IsSafeDifference = (difference: number) =>
    difference >= this.MinimumSafeDifference && difference <= this.MaximumSafeDifference

  static Create = (levels: Array<number>) =>
    levels.length >= 2
      ? Effect.succeed(new ReactorSafetyReport(levels))
      : Effect.fail(new Error("At least 2 levels are required"))

  private levels: Array<number> = []

  private constructor(levels: Array<number>) {
    this.levels = levels
  }

  isReactorSafe() {
    const isIncreasing = this.levels[1] > this.levels[0]
    for (let i = 1; i < this.levels.length; i++) {
      const levelIncreased = this.levels[i] > this.levels[i - 1]
      if (
        isIncreasing && !levelIncreased ||
        !isIncreasing && levelIncreased ||
        !ReactorSafetyReport.IsSafeDifference(Math.abs(this.levels[i] - this.levels[i - 1]))
      ) return false
    }
    return true
  }
}

const parseInput = (input: string) => {
  const lines = input.split("\n")
  return Effect.all(
    lines.filter((line) => line).map((line) => {
      const levels = line.split(" ").filter(Number).map(Number)
      return ReactorSafetyReport.Create(levels)
    })
  )
}

export const part1 = (input: string) =>
  Effect.gen(function*() {
    const reports = yield* parseInput(input)
    return reports.reduce((safeReports, report) => report.isReactorSafe() ? safeReports + 1 : safeReports, 0)
  })
