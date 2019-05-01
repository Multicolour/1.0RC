interface BadCharTable {
  [char: string]: number,
}

interface ParsedFields {
  [field: string]: any | File,
}

type SeparatedBodyParts = string[]

export default class BoyerMooreHorspool {
  public needle: Buffer
  private badCharTable: BadCharTable = {}

  constructor(needle: string) {
    this.needle = Buffer.from(needle)
    this.badCharTable = this.makeBadCharTable()
  }

  public getBodyFieldStrings(body: Buffer, boundaryIndices: number[]): SeparatedBodyParts {
    const bodyParts = []
    for (let currentMatchIndex = 0, max = boundaryIndices.length; currentMatchIndex <= max; currentMatchIndex += 1) {
      const bodyPiece = Buffer.alloc(boundaryIndices[currentMatchIndex + 1])

      body.copy(bodyPiece, boundaryIndices[currentMatchIndex], boundaryIndices[currentMatchIndex + 1])

      bodyParts.push(bodyPiece.toString())
    }

    return bodyParts
  }

  public parseBodyFields(bodyParts: string[]): ParsedFields {
    console.log(bodyParts)
    return {}
  }

  public search(haystack: Buffer) {
    const results: number[] = []
    let skip = 1
    for (
      let haystackChar = 0, maxHaystackChar = haystack.length - 1;
      haystackChar <= maxHaystackChar;
      haystackChar += skip
    ) {
      needle: for (let needleChar: number = this.needle.length - 1; needleChar >= 0; needleChar--) {
        if (haystack[haystackChar + needleChar] !== this.needle[needleChar]) {
          skip = this.badCharTable.hasOwnProperty(haystack[haystackChar + needleChar])
            ? this.badCharTable[haystack[haystackChar + needleChar]]
            : this.needle.length
          break needle
        }
        else if (needleChar === 0) {
          results.push(haystackChar)
          skip = this.needle.length
          break needle
        }
      }
    }

    return results
  }

  private makeBadCharTable(): BadCharTable {
    const badCharTable: BadCharTable = {}
    for (let char: number = 0, max = this.needle.length; char < max; char++) {
      const charCode = this.needle[char]
      if (char === max - 1 && badCharTable.hasOwnProperty(charCode)) {
        break
      }

      if (char === max - 1) {
        badCharTable[charCode] = max
      }
      else {
        badCharTable[charCode] = max - char - 1
      }
    }

    return badCharTable
  }
}
