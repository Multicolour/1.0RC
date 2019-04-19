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
