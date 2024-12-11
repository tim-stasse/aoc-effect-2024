import * as Effect from "effect/Effect"

class Vector {
  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  add(value: Vector) {
    return new Vector(this.x + value.x, this.y + value.y)
  }
}

enum Direction {
  North,
  NorthEast,
  East,
  SouthEast,
  South,
  SouthWest,
  West,
  NorthWest
}

const directionMap = new Map([
  [Direction.North, new Vector(0, 1)],
  [Direction.NorthEast, new Vector(1, 1)],
  [Direction.East, new Vector(1, 0)],
  [Direction.SouthEast, new Vector(1, -1)],
  [Direction.South, new Vector(0, -1)],
  [Direction.SouthWest, new Vector(-1, -1)],
  [Direction.West, new Vector(-1, 0)],
  [Direction.NorthWest, new Vector(-1, 1)]
])

class WordSearch {
  characters: Array<Array<string>> = []

  constructor(characters: Array<Array<string>>) {
    this.characters = characters
  }

  private getCharacterAtPosition(position: Vector) {
    return (this.characters[position.x] ?? [])[position.y]
  }

  private isWordAtPositionInDirection(word: string, position: Vector, direction: Direction) {
    let currentPosition = position
    for (let i = 0; i < word.length; i++) {
      const character = this.getCharacterAtPosition(currentPosition)
      if (character !== word[i]) return false
      currentPosition = currentPosition.add(directionMap.get(direction)!)
    }
    return true
  }

  private searchForWordInstancesAtPosition(word: string, position: Vector) {
    const wordInstances: Array<[Vector, Direction]> = []
    for (const direction of directionMap.keys()) {
      if (this.isWordAtPositionInDirection(word, position, direction)) {
        wordInstances.push([position, direction])
      }
    }
    return wordInstances
  }

  searchForWordInstances(word: string) {
    let wordInstances: Array<[Vector, Direction]> = []
    for (let y = 0; y < this.characters.length; y++) {
      for (let x = 0; x < this.characters[y].length; x++) {
        const position = new Vector(x, y)
        const character = this.getCharacterAtPosition(position)
        if (word.startsWith(character)) {
          const foundInstances = this.searchForWordInstancesAtPosition(word, position)
          wordInstances = [...wordInstances, ...foundInstances]
        }
      }
    }
    return wordInstances
  }
}

const parseInput = (input: string) => {
  const lines = input.split("\n").filter((line) => line)
  return new WordSearch(lines.map((line) => line.split("")))
}

export const part1 = (input: string) => {
  const wordSearch = parseInput(input)
  return Effect.succeed(wordSearch.searchForWordInstances("XMAS").length)
}

export const part2 = (_input: string) => Effect.succeed(0)
