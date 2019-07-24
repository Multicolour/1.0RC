import {
  CreateTrie,
  // InsertNodeIntoTrie,
  // Node,
  // RemoveNodeFromTrie,
  SearchTrie,
} from "@lib/server/radix-trie"

type TestData = string

/*const testData: Node[] = [
  {
    text: "/hi",
  },
  {
    text: "/cats",
  },
  {
    text: "/contact",
  },
  {
    text: "/con",
  },
  {
    text: "/cona",
  },
]*/

const testTrieA = CreateTrie<TestData>()
testTrieA.nodes = [
  {
    text: "/",
    nodes: [
      {
        text: "s",
        nodes: [
          {
            text: "uper",
            data: "SUPER",
          },
          {
            text: "illy",
            data: "SILLY",
          },
        ],
      },
      {
        text: "c",
        nodes: [
          {
            text: "ats",
            data: "CATS",
          },
          {
            text: "o",
            nodes: [
              {
                text: "py",
                data: "COPY",
              },
              {
                text: "n",
                nodes: [
                  {
                    text: "tact",
                    data: "CONTACT",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]

/*testData.forEach((node: Node) => {
  test("Searching for " + node.text, () => {
    expect(SearchTrie(testTrieA, node.text)).toBeTruthy()
  })
})*/
test("Basic /cats", () => {
  expect(SearchTrie<TestData>(testTrieA, "/cats")).toEqual({
    text: "ats",
    data: "CATS",
  })
})

test("Basic /contact", () => {
  expect(SearchTrie<TestData>(testTrieA, "/contact")).toEqual({
    text: "tact",
    data: "CONTACT",
  })
})

test("Basic /copy", () => {
  expect(SearchTrie<TestData>(testTrieA, "/copy")).toEqual({
    text: "py",
    data: "COPY",
  })
})

test("Basic /super", () => {
  expect(SearchTrie<TestData>(testTrieA, "/super")).toEqual({
    text: "uper",
    data: "SUPER",
  })
})

test("Basic /silly", () => {
  expect(SearchTrie<TestData>(testTrieA, "/silly")).toEqual({
    text: "illy",
    data: "SILLY",
  })
})
