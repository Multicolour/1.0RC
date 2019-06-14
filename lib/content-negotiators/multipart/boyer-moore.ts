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
    this.pattern = Buffer.from(pattern, "utf-8")
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

      const size = boundaryIndices[nextIndex] - (boundaryIndices[currentMatchIndex] + this.pattern.length)
      const bodyPiece = Buffer.alloc(size)

      body.copy(bodyPiece, 0, boundaryIndices[currentMatchIndex] + this.pattern.length, boundaryIndices[nextIndex])

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

      // Get the index at which the headers break from the body.
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
      let haystackChar = 0, maxTextChar = text.length - 1;
      haystackChar <= maxTextChar;
      haystackChar += skip
    ) {
      pattern: for (let needleChar: number = this.pattern.length - 1; needleChar >= 0; needleChar--) {
        const lookupIndex = haystackChar + needleChar
        skip = this.badCharShift[text[lookupIndex]]

        if (text[lookupIndex] !== this.pattern[needleChar]) {
          break pattern
        }
        else if (needleChar === 0) {
          results.push(haystackChar)

          // Exit if there's a limit.
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
    const badCharShift: Buffer = Buffer.alloc(256)

    // Populate the table with the default.
    for (let i = 0; i <= 256; i++) {
      badCharShift[i] = this.pattern.length
    }

    // Add our offsets.
    for (
      let char: number = 0,
      max = this.pattern.length - 1;
      char < max;
      char++
    ) {
      badCharShift[this.pattern[char]] = Math.max(max - 1 - char, 1)
    }

    return badCharShift
  }
}

export default BoyerMooreHorspool

