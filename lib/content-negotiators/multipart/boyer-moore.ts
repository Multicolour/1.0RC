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
    this.needle = Buffer.from(needle.trim())
    this.badCharTable = this.makeBadCharTable()
  }

  public getBodyFieldStrings(body: Buffer, boundaryIndices: number[]): SeparatedBodyParts {
    console.log("BI", boundaryIndices, "\n", body.toString())
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

      // const size = body.length - boundaryIndices[index] - this.needle.length
      const size = boundaryIndices[nextIndex] - (boundaryIndices[currentMatchIndex] + this.needle.length)
      console.log(currentMatchIndex, nextIndex, "SIZE", size)
      const bodyPiece = Buffer.alloc(size)

      body.copy(bodyPiece, 0, boundaryIndices[currentMatchIndex] + this.needle.length, boundaryIndices[nextIndex])

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
