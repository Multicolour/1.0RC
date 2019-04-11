// Unlicensed but from https://gist.github.com/Kamilczak020/f8382eef9777e8f07d47be29a4efc04b.

const boyerMoore = {

  alphabetSize: 256,

  /*
    Returns the index of the first occurence of
    the `needle` buffer within the `haystack` buffer.

    @param {Buffer} needle
    @param {Buffer} haystack
    @return {Integer}
  */
  indexOf(needle: Buffer, haystack: Buffer) {

    let i
    let k
    const n = needle.length
    const m = haystack.length

    if ( n === 0 ) { return n }

    const charTable = this.makeCharTable( needle )
    const offsetTable = this.makeOffsetTable( needle )

    for ( i = n - 1; i < m; ) {
      for ( k = n - 1; needle[k] === haystack[i]; --i, --k ) {
        if ( k === 0 ) { return i }
      }
      // i += n - k; // for naive method
      i += Math.max( offsetTable[ n - 1 - k ], charTable[ haystack[i] ] )
    }

    return -1

  },

  /*
    Makes the jump table based on the
    mismatched character information.

    @param {Buffer} needle
    @return {Buffer}
  */
  makeCharTable(needle: Buffer): Uint32Array {

    const table = new Uint32Array( this.alphabetSize )
    let n = needle.length
    const t = table.length
    let i = 0

    for ( ; i < t; ++i ) {
      table[i] = n
    }

    n--

    for ( i = 0; i < n; ++i ) {
      table[ needle[i] ] = n - i
    }

    return table

  },

  /*
    Makes the jump table based on the
    scan offset which mismatch occurs.

    @param {Buffer} needle
  */
  makeOffsetTable(needle: Buffer) {

    let i
    let suffix
    const n = needle.length
    const m = n - 1
    let lastPrefix = n
    const table = new Uint32Array( n )

    for ( i = m; i >= 0; --i ) {
      if ( this.isPrefix( needle, i + 1 ) ) {
        lastPrefix = i + 1
      }
      table[ m - i ] = lastPrefix - i + m
    }

    for ( i = 0; i < n; ++i ) {
      suffix = this.suffixLength( needle, i )
      table[ suffix ] = m - i + suffix
    }

    return table

  },

  /*
    Is `needle[i:end]` a prefix of `needle`?

    @param {Buffer} needle
    @param {Integer} i
  */
  isPrefix(needle: Buffer, i: number): boolean {

    let k = 0
    const n = needle.length

    for ( ; i < n; ++i, ++k ) {
      if ( needle[i] !== needle[k] ) {
        return false
      }
    }

    return true

  },

  /*
    Returns the maximum length of the
    substring ends at `i` and is a suffix.

    @param {Buffer} needle
    @param {Integer} i
  */
  suffixLength(needle: Buffer, i: number): number {

    let k = 0
    const n = needle.length
    let m = n - 1

    for ( ; i >= 0 && needle[i] === needle[m]; --i, --m ) {
      k += 1
    }

    return k

  },

}

export default boyerMoore
