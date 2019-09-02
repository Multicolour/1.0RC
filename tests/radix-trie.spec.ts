import {
  CreateTrie,
  InsertNodeIntoTrie,
  NodeType,
  SearchTrie,
} from "@lib/server/radix-trie"

type TestData = string

test("Insert first node", () => {
  const testTrie = CreateTrie<TestData>()

  InsertNodeIntoTrie<TestData>(testTrie, "/super", "SUPER")

  expect(testTrie).toEqual({
    text: "",
    type: NodeType.PLAIN,
    nodes: [{
      text: "/super",
      data: "SUPER",
      type: NodeType.PLAIN,
    }],
  })
})

test("Insert second node", () => {
  const testTrie = CreateTrie<TestData>()

  InsertNodeIntoTrie<TestData>(testTrie, "/super", "SUPER")

  expect(testTrie).toEqual({
    text: "",
    type: NodeType.PLAIN,
    nodes: [{
      text: "/super",
      data: "SUPER",
      type: NodeType.PLAIN,
    }],
  })


  InsertNodeIntoTrie<TestData>(testTrie, "/cats", "CATS")

  expect(testTrie).toEqual({
    text: "",
    type: NodeType.PLAIN,
    nodes: [
      {
        text: "/",
        nodes: [
          {
            text: "super",
            data: "SUPER",
            type: NodeType.PLAIN,
          },
          {
            text: "cats",
            data: "CATS",
            type: NodeType.PLAIN,
          },
        ],
      },
    ],
  })
})

const testTrieA = CreateTrie<TestData>("/")
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
