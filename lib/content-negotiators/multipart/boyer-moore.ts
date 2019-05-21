interface BadCharTable {
  [char: string]: number,
}

interface ParsedFields {
  [field: string]: any | File,
}

type SeparatedBodyParts = Buffer[]

export default class BoyerMooreHorspool {
  public needle: Buffer
  private badCharTable: BadCharTable = {}

  constructor(needle: string) {
    this.needle = Buffer.from(needle)
    console.log(this.needle.toString())
    this.badCharTable = this.makeBadCharTable()
  }

  public getBodyFieldStrings(body: Buffer, boundaryIndices: number[]): SeparatedBodyParts {
    const bodyParts = []
    for (
      let currentMatchIndex = 0,
          max = boundaryIndices.length - 1;
      currentMatchIndex <= max;
      currentMatchIndex += 1
    ) {
      // We can exit here since the last index is the closing boundary.
      if (currentMatchIndex === max) {
        break
      }

      const nextIndex = currentMatchIndex === max
        ? currentMatchIndex
        : currentMatchIndex + 1

      const size = boundaryIndices[nextIndex] - (boundaryIndices[currentMatchIndex] + this.needle.length)
      const bodyPiece = Buffer.alloc(size)

      body.copy(bodyPiece, 0, boundaryIndices[currentMatchIndex] + this.needle.length, boundaryIndices[nextIndex])

      bodyParts.push(bodyPiece)
    }

    return bodyParts
  }

  public parseBodyFields(bodyParts: Buffer[]): ParsedFields {
    const lineBreakerAlgo = new BoyerMooreHorspool("\r\n\r\n")
    for (let bodyPartIndex = 0, max = bodyParts.length; bodyPartIndex < max; bodyPartIndex += 1) {
      const headerBodyBreakIndex = lineBreakerAlgo.search(bodyParts[bodyPartIndex], 1)

      console.log(headerBodyBreakIndex, bodyParts[bodyPartIndex].toString())
    }
    return {}
  }

  /**
   * Perform a search on the `haystack`
   *
   * @param {Buffer} haystack - The haystack to search.
   * @param {number} limit - The max number of results. a 0 means no limit.
   *
   * @return number[] array of indices where needle starts.
   */
  public search(haystack: Buffer, limit: number = 0) {
    const results: number[] = []
    let skip = 1
    haystackLoop: for (
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

          // Exit if there's a limit.
          if (limit !== 0 && results.length >= limit) {
            break haystackLoop
          }

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
