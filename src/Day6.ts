import * as Effect from "effect/Effect"
import * as Match from "effect/Match"

class Vector {
  static up = new Vector(0, -1)
  static down = new Vector(0, 1)
  static left = new Vector(-1, 0)
  static right = new Vector(1, 0)

  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  add(value: Vector) {
    return new Vector(this.x + value.x, this.y + value.y)
  }

  isEqual(value: Vector) {
    return this.x === value.x && this.y === value.y
  }
}

class GuardGallivant {
  startingPosition: Vector
  bounds: Vector
  obstacles: Array<Vector>

  constructor(startingPosition: Vector, bounds: Vector, obstacles: Array<Vector>) {
    this.startingPosition = startingPosition
    this.bounds = bounds
    this.obstacles = obstacles
  }

  clone() {
    return new GuardGallivant(this.startingPosition, this.bounds, [...this.obstacles])
  }

  isOutOfBounds(position: Vector) {
    return position.x < 0 || position.y < 0 || position.x >= this.bounds.x || position.y >= this.bounds.y
  }

  get predictedRoute() {
    let currentPosition = this.startingPosition
    let currentDirection = Vector.up
    const route: Array<[Vector, Vector]> = []

    while (!this.isOutOfBounds(currentPosition)) {
      if (
        route.some(([position, direction]) =>
          position.isEqual(currentPosition) &&
          direction.isEqual(currentDirection)
        )
      ) {
        return [true, route] as const
      }

      route.push([currentPosition, currentDirection])
      const nextPosition = currentPosition.add(currentDirection)

      if (this.obstacles.some((obstacle) => nextPosition.isEqual(obstacle))) {
        Match.value(currentDirection).pipe(
          Match.when(Vector.up, () => {
            currentDirection = Vector.right
          }),
          Match.when(Vector.right, () => {
            currentDirection = Vector.down
          }),
          Match.when(Vector.down, () => {
            currentDirection = Vector.left
          }),
          Match.when(Vector.left, () => {
            currentDirection = Vector.up
          })
        )
        continue
      }

      currentPosition = nextPosition
    }

    return [false, route] as const
  }

  get traversedPositions() {
    const traversedPositions: Array<Vector> = []
    const [, route] = this.predictedRoute
    for (const [position] of route) {
      if (traversedPositions.every((traversedPosition) => !position.isEqual(traversedPosition))) {
        traversedPositions.push(position)
      }
    }
    return traversedPositions
  }
}

const parseInput = (input: string) => {
  const lines = input.trimEnd().split("\n")
  const bounds = new Vector(lines[0].length, lines.length)

  let startingPosition = new Vector(0, 0)
  const obstacles: Array<Vector> = []

  for (let y = 0; y < lines.length; y++) {
    const line = lines[y]
    for (let x = 0; x < line.length; x++) {
      const char = line.charAt(x)
      Match.value(char).pipe(
        Match.when("^", () => {
          startingPosition = new Vector(x, y)
        }),
        Match.when("#", () => {
          obstacles.push(new Vector(x, y))
        })
      )
    }
  }

  return new GuardGallivant(startingPosition, bounds, obstacles)
}

export const part1 = (input: string) => {
  const guardGallivant = parseInput(input)
  return Effect.succeed(guardGallivant.traversedPositions.length)
}

export const part2 = (input: string) => {
  const guardGallivant = parseInput(input)
  let routeLoopCount = 0
  for (const position of guardGallivant.traversedPositions) {
    if (position.isEqual(guardGallivant.startingPosition)) {
      continue
    }
    const possibleGuardGallivant = guardGallivant.clone()
    possibleGuardGallivant.obstacles.push(position)
    const [routeDoesLoop] = possibleGuardGallivant.predictedRoute
    if (routeDoesLoop) routeLoopCount++
  }
  return Effect.succeed(routeLoopCount)
}
