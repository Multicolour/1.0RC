interface BadCharTable {
  [char: string]: number,
}

export default class BoyerMooreHorspool {
  private badCharTable: BadCharTable = {}

  constructor(public needle: string) {
    this.badCharTable = this.makeBadCharTable()
    console.log("badCharTable", this.badCharTable)
  }

  public search(haystack: Buffer, start: number = 0) {
    const results: number[] = []
    let skip = 1
    for (
      let haystackChar = start, maxHaystackChar = haystack.length - 1;
      haystackChar < maxHaystackChar;
      haystackChar += skip
    ) {
      needle: for (let needleChar: number = this.needle.length - 1; needleChar >= 0; needleChar--) {
        if (haystack[haystackChar + needleChar] !== this.needle.charCodeAt(needleChar)) {
          skip = this.badCharTable.hasOwnProperty(haystack[haystackChar])
            ? this.badCharTable[haystack[haystackChar]]
            : this.needle.length - 1
          break needle
        }
        else if (needleChar === 0) {
          results.push(haystackChar)
          skip = this.needle.length - 1
          break needle
        }
      }
    }

    return results
  }

  private makeBadCharTable(): BadCharTable {
    const badCharTable: BadCharTable = {}
    for (let char: number = 0, max = this.needle.length - 1; char < max; char++) {
      if (char === max - 1 && badCharTable.hasOwnProperty(this.needle[char])) {
        break
      }

      if (char === max - 1) {
        badCharTable[this.needle.charCodeAt(char)] = max
      }
      else {
        badCharTable[this.needle.charCodeAt(char)] = max - char - 1
      }

    }

    return badCharTable
  }
}
