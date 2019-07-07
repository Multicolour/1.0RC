interface ParsedField {
  headers: object,
  value: any,
}

interface ParsedFields {
  [field: string]: ParsedField | ParsedField[],
}

class BoyerMooreHorspool {
  public pattern: Buffer
  private badCharShift: Buffer

  constructor(pattern: string) {
    this.pattern = Buffer.from(pattern)
    this.badCharShift = this.makeBadCharTable()
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
    // Loop over the indices - 2 (-1 for true length, -1 to ignore body terminator.
    for (
      let currentMatchIndex = 0,
          max = boundaryIndices.length - 2;
      currentMatchIndex < max;
      currentMatchIndex++
    ) {
      const bodyPiece = body.slice(boundaryIndices[currentMatchIndex] + this.pattern.length - 1, boundaryIndices[currentMatchIndex + 1])

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
    for (let bodyPartIndex = 0, max = bodyParts.length; bodyPartIndex < max; bodyPartIndex++) {
      const field = bodyParts[bodyPartIndex]

      // Get the index at which the headers break from the body.
      const headerBodyBreakIndex = lineBreakerAlgo.search(field, 1)

      // @FIXME DO NOT LEAVE THIS HERE.
      if (!headerBodyBreakIndex.length) {
        console.error("DID NOT FIND HEADER BREAKER IN FIELD", headerBodyBreakIndex, JSON.stringify(field.toString()))
        console.log("\n".repeat(4))
        continue
      }

      // Create new target buffers to copy into
      const headersBuffer = field.slice(0, headerBodyBreakIndex[0])
      // const fieldValueBuffer = field.slice(headerBodyBreakIndex[0] + 4, field.length - 1)

      console.log("HEADERS", JSON.stringify(headersBuffer.toString().split(";")))
      console.log("\n".repeat(4))
    }
    return out
  }

  /**
   * Perform a search on the `text`
   *
   * @param {Buffer} text - The text to search.
   * @param {number} limit - The max number of results. a 0 means no limit.
   *
   * @return number[] array of indices where pattern starts.
   */
  public search(text: Buffer, limit: number = 0) {
    const results: number[] = []
    let skip = 0

    haystackLoop: for (
      let haystackChar = 0, 
          maxTextChar = text.length - 1;
      haystackChar <= maxTextChar;
      haystackChar += skip
    ) {
      pattern: for (
        let needleChar = this.pattern.length - 1; 
        needleChar >= 0; 
        needleChar--
      ) {
        const lookupIndex = haystackChar + needleChar
        skip = this.badCharShift[text[haystackChar + (this.pattern.length - 1)]]

        if (text[lookupIndex] !== this.pattern[needleChar]) {
          break pattern
        }
        else if (needleChar === 0) {
          results.push(haystackChar)
          skip = this.pattern.length

          if (limit !== 0 && results.length >= limit) {
            break haystackLoop
          }

          break pattern
        }
      }
    }

    return results
  }

  private makeBadCharTable(): Buffer {
    const DICT_SIZE = 65535
    const badCharShift: Buffer = Buffer.allocUnsafe(DICT_SIZE)
    const truePatternLength = this.pattern.length - 1

    // Populate the table with the default.
    for (let i = 0; i <= DICT_SIZE; i++) {
      badCharShift[i] = this.pattern.length
    }

    // Add our offsets.
    for (
      let char: number = 0;
      char < truePatternLength;
      char++
    ) {
      
      badCharShift[this.pattern[char]] = truePatternLength - char
    }

    return badCharShift
  }
}

export default BoyerMooreHorspool

