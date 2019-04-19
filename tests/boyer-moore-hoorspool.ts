import BoyerMooreHorspool from "@lib/content-negotiators/multipart/boyer-moore"


[
  {
    text: "a".repeat(10) + "b",
    pattern: "aab",
    expected: [8],
  },
  {
    text: "aab" + "1".repeat(10),
    pattern: "aab",
    expected: [0],
  },
  {
    text: "aab".repeat(3),
    pattern: "aab",
    expected: [0, 3, 6],
  },
  {
    text: "trusthardtoothbrushes",
    pattern: "tooth",
    expected: [10],
  },
  {
    text: "toothbrushestoothbrushes",
    pattern: "tooth",
    expected: [0, 12],
  },
].forEach((payload) => {
test("ensuring Boyer Moore Hoorspool algorithm works with static payload: " + payload.text, () => {
    const instance = new BoyerMooreHorspool(payload.pattern)

    expect(instance.search(Buffer.from(payload.text))).toEqual(payload.expected)

  })
})

function getRandomString(length = Math.floor(1000 * Math.random())): string {
  let out = ""
  while (length--) {
    out += String.fromCharCode( 48 + ~~(Math.random() * 42))
  }
  return out
}

for (let testIndex = 0, maxTests = 25; testIndex <= maxTests; testIndex++) {
  console.log(testIndex)
  const testText = getRandomString()
  const expected = Math.floor(Math.random() * testText.length)
  const pattern = testText.substr(expected, Math.floor(Math.random() * testText.length))

  test("ensuring Boyer Moore Hoorspool algorithm works with random payload" + pattern, () => {
    const instance = new BoyerMooreHorspool(pattern)
    expect(instance.search(Buffer.from(testText))).toEqual([expected])
  })
}
