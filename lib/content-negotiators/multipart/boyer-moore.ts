interface BadCharTable {
  [char: string]: number,
}

export default class BoyerMooreHorspool {
  private badCharTable: BadCharTable = {}

  constructor(public needle: string) {
    this.badCharTable = this.makeBadCharTable()
  }

  public search(haystack: Buffer, start: number = 0) {
    let skip = 1
    for (
      let haystackChar = start, maxHaystackChar = haystack.length;
      haystackChar < maxHaystackChar;
      haystackChar += skip
    ) {
      for (let needleChar: number = this.needle.length; needleChar >= 0; needleChar--) {
        if (haystack[haystackChar] !== this.needle.charCodeAt(needleChar)) {
          skip = this.badCharTable.hasOwnProperty(haystack[haystackChar])
            ? this.badCharTable[haystack[haystackChar]]
            : this.needle.length
        }
        else if (needleChar === 0) {
          return haystackChar
        }
      }
    }

    return -1
  }

  private makeBadCharTable(): BadCharTable {
    const badCharTable: BadCharTable = {}
    for (let char: number = 0, max = this.needle.length; char < max; char++) {
      badCharTable[this.needle[char]] = max - char - 1
    }

    return badCharTable
  }
}
