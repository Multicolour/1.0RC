import {
  CreateTrie,
  // InsertNodeIntoTrie,
  Node,
  // RemoveNodeFromTrie,
  SearchTrie,
} from "@lib/server/radix-trie"

const testData: Node[] = [
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
]

const testTrieA = CreateTrie()
testTrieA.nodes = [
  {
    text: "/",
    nodes: [
      {
        text: "c",
        nodes: [
          {
            text: "ats",
          },
          {
            text: "on",
            nodes: [
              {
                text: "a",
              },
              {
                text: "tact",
              },
            ],
          },
        ],
      },
    ],
  },
]

testData.forEach((node: Node) => {
  test("Searching for " + node.text, () => {
    expect(SearchTrie(testTrieA, node.text)).toBeTruthy()
  })
})

