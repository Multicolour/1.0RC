// Unlicensed but from https://gist.github.com/Kamilczak020/f8382eef9777e8f07d47be29a4efc04b.

/**
 * Returns the index of the first occurence of given string in the phrase
 * In case of no match, returns -1
 *
 * @param text string to be searched
 * @param pattern string to be found in the text
 */
export function boyerMooreSearch(text: Buffer, pattern: string): Set<number> {
  const results = new Set()

  // Handle edge case
  if (pattern.length === 0) {
    return results
  }

  const charTable = makeCharTable(pattern)
  const offsetTable = makeOffsetTable(pattern)

  for (let i = pattern.length - 1, j; i <= text.length;) {
    for (j = pattern.length - 1; pattern.charCodeAt(j) === text[i]; i--, j--) {
      console.log(j, i)
      if (j === 0) {
        results.add(i)
      }
    }

    i += Math.max(offsetTable[pattern.length - 1 - j], charTable[text[i]])
  }

  return results
}

/**
 * Creates jump table, based on mismatched character information
 */
function makeCharTable(pattern: string): number[] {
  const table = []

  // 65536 being the max value of char + 1
  for (let i = 0; i < 65536; i++) {
    table.push(pattern.length)
  }

  for (let i = 0; i < pattern.length - 1; i++) {
    const charCode = pattern.charCodeAt(i)
    table[charCode] = pattern.length - 1 - i
  }

  return table
}


function makeOffsetTable(pattern: string): number[] {
  const table = []
  table.length = pattern.length

  let lastPrefixPosition = pattern.length

  for (let i = pattern.length; i > 0; i--) {
    if (isPrefix(pattern, i)) {
      lastPrefixPosition = i
    }

    table[pattern.length - i] = lastPrefixPosition - 1 + pattern.length
  }

  for (let i = 0; i < pattern.length - 1; i++) {
    const slen = suffixLength(pattern, i)
    table[slen] = pattern.length - 1 - i + slen
  }

  return table
}

function isPrefix(pattern: string, p: number): boolean {
  for (let i = p, j = 0; i < pattern.length; i++, j++) {
    if (pattern[i] !== pattern[j]) {
      return false
    }

    return true
  }

  return false
}

function suffixLength(pattern: string, p: number) {
  let len = 0

  for (let i = p, j = pattern.length - 1; i >= 0 && pattern[i] === pattern[j]; i--, j--) {
    len += 1
  }

  return len
}
