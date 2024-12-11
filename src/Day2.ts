import * as Effect from "effect/Effect"
import * as Stream from "effect/Stream"

class ReactorSafetyReport {
  static MinimumSafeDifference = 1
  static MaximumSafeDifference = 3

  static IsSafeDifference = (difference: number) =>
    difference >= this.MinimumSafeDifference && difference <= this.MaximumSafeDifference

  static Create = (levels: Array<number>): Effect.Effect<ReactorSafetyReport, Error, never> =>
    levels.length >= 2
      ? Effect.succeed(new ReactorSafetyReport(levels))
      : Effect.fail(new Error("At least 2 levels are required"))

  static ProblemDampenerVariations(levels: Array<number>) {
    return Stream.fromIterable({
      *[Symbol.iterator]() {
        yield ReactorSafetyReport.Create([...levels])
        for (let i = 0; i < levels.length; i++) {
          yield ReactorSafetyReport.Create([...levels].splice(i, 1))
        }
      }
    })
  }

  private levels: Array<number> = []

  private constructor(levels: Array<number>) {
    this.levels = levels
  }

  get isReactorSafe() {
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

  get problemDampenerVariations() {
    return {
      levels: this.levels,
      *[Symbol.iterator]() {
        for (let i = 0; i < this.levels.length; i++) {
          const levels = [...this.levels]
          levels.splice(i, 1)
          yield ReactorSafetyReport.Create(levels)
        }
      }
    }
  }

  get hasSafeVariations() {
    return Effect.gen(this, function*() {
      for (const variation of this.problemDampenerVariations) {
        const report = yield* variation
        if (report.isReactorSafe) {
          return true
        }
      }
      return false
    })
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
    return reports.reduce((safeReports, report) => report.isReactorSafe ? safeReports + 1 : safeReports, 0)
  })

export const part2 = (input: string) =>
  Effect.gen(function*() {
    const reports = yield* parseInput(input)
    return yield* reports.reduce((safeReports, report) =>
      Effect.gen(function*() {
        if (report.isReactorSafe) {
          return (yield* safeReports) + 1
        }
        const hasSafeVariations = yield* report.hasSafeVariations
        if (hasSafeVariations) {
          return (yield* safeReports) + 1
        }
        return yield* safeReports
      }), Effect.succeed(0) as Effect.Effect<number, Error, never>)
  })
