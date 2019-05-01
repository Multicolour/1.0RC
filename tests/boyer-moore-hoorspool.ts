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
    text: "toothbrushestoothbrushes",
    pattern: "tooth",
    expected: [0, 12],
  },
  {
    text: "trusthardtoothbrushes",
    pattern: "tooth",
    expected: [9],
  },
  {
    text: "👍👎🖐❤🌷🍀🌱🐕",
    pattern: "👍",
    expected: [0],
  },
].forEach((payload) => {
  test("ensuring Boyer Moore Hoorspool algorithm works with static payload: " + payload.text, () => {
    const instance = new BoyerMooreHorspool(payload.pattern)
    const indices = instance.search(Buffer.from(payload.text))

    expect(indices).toEqual(payload.expected)
  })
})

function getRandomString(): string {
  let out = ""
  for (let i = 1, max = 500; i < max; i++) {
    out += String.fromCharCode(48 + ~~(Math.random() * 42))
  }
  return out
}

for (let testIndex = 0, maxTests = 25; testIndex <= maxTests; testIndex++) {
  const testText = getRandomString()
  const expected = Math.floor(Math.random() * testText.length)

  // Skip over tiny payloads.
  if (testText.length < 5) {
    continue
  }

  const pattern = testText.substr(expected, Math.floor(Math.random() * 51))

  if (pattern.length < 5) {
    continue
  }

  test("ensuring Boyer Moore Hoorspool algorithm works with random payload: " + pattern, () => {
    const instance = new BoyerMooreHorspool(pattern)
    expect(instance.search(Buffer.from(testText))).toEqual([expected])
  })
}

