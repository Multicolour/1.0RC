interface BadCharTable {
  [char: string]: number,
}

interface ParsedField {
  headers: object,
  value: any,
}

interface ParsedFields {
  [field: string]: ParsedField | ParsedField[],
}

export default class BoyerMooreHorspool {
  public needle: Buffer
  private badCharTable: BadCharTable = {}

  constructor(needle: string) {
    this.needle = Buffer.from(needle)
    this.badCharTable = this.makeBadCharTable()
  }

  /**
   * Use the resulting indices from BoyerMooreHorspool.search(buffer: Buffer)
   * to split out the fields of the request ready for parsing.
   *
   * @param {Buffer} body to split fields out of
   * @param {number[]} boundaryIndices to split body at.
   * @return {Buffer[]} Array of newly created buffers containing raw field data ready to be parsed.
   */
  public getBodyFieldStrings(body: Buffer, boundaryIndices: number[]): Buffer[] {
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

  /**
   * Perform another search for the Multipart header/field separator
   * and split the headers from the field value.
   *
   * @param {Buffer[]} bodyParts from running
   *  BoyerMooreHorspool.getBodyFieldStrings(body: Buffer, boundaryIndices: number[])
   * @return {ParsedFields} object of fields parsed from the request.
   */
  public parseBodyFields(bodyParts: Buffer[]): ParsedFields {
    const lineBreakerAlgo = new BoyerMooreHorspool("\r\n\r\n")
    const out = {}

    // Split each field into two parts. Headers and field value.
    for (let bodyPartIndex = 0, max = bodyParts.length; bodyPartIndex < max; bodyPartIndex += 1) {
      const field = bodyParts[bodyPartIndex]
      const headerBodyBreakIndex = lineBreakerAlgo.search(field, 1)

      // @FIXME DO NOT LEAVE THIS HERE.
      if (!headerBodyBreakIndex.length) {
        console.error("DID NOT FIND HEADER BREAKER IN FIELD", JSON.stringify(field.toString()))
        continue
      }

      // Create new target buffers to copy into
      const headersBuffer = Buffer.alloc(headerBodyBreakIndex[0])
      const fieldValueBuffer = Buffer.alloc(field.length - (headerBodyBreakIndex[0] + 4))

      // Copy the field data into the new buffers.
      field.copy(headersBuffer, 0, 0, headerBodyBreakIndex[0])
      field.copy(fieldValueBuffer, 0, headerBodyBreakIndex[0] + 4, field.length)


      console.log(headerBodyBreakIndex)
      console.log("HEADERS", JSON.stringify(headersBuffer.toString()))
      console.log("FIELD VALUE", JSON.stringify(fieldValueBuffer.toString()))
    }
    return out
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
    const asString = haystack.toString()
    let skip = 0
    haystackLoop: for (
      let haystackChar = 0, maxHaystackChar = haystack.length - 1;
      haystackChar <= maxHaystackChar;
      haystackChar += skip
    ) {
      needle: for (let needleChar: number = this.needle.length - 1; needleChar >= 0; needleChar--) {
        const lookupIndex = haystackChar + needleChar
        if (haystack[lookupIndex] !== this.needle[needleChar]) {
          skip = this.badCharTable.hasOwnProperty(haystack[lookupIndex])
            ? this.badCharTable[haystack[lookupIndex]]
            : this.needle.length

          // tslint:disable-next-line
          console.log("%s\n Skipping %d,\n mismatch was %s !== %s.\n Char %d in table? %s,\n Portion %s", JSON.stringify(this.needle.toString()), skip, String.fromCharCode(haystack[lookupIndex]), String.fromCharCode(this.needle[needleChar]), haystackChar, this.badCharTable.hasOwnProperty(haystack[lookupIndex]), JSON.stringify(asString.substring(haystackChar, haystackChar + this.needle.length)))
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
