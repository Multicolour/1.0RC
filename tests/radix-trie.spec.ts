import {
  CreateTrie,
  InsertNodeIntoTrie,
  SearchTrie,
} from "@lib/server/radix-trie"

type TestData = string

test("Insert super", () => {
  const testTrie = CreateTrie<TestData>()

  InsertNodeIntoTrie<TestData>(testTrie, "/super", "SUPER")

  expect(testTrie).toEqual({
    text: "/super",
    data: "SUPER",
    nodes: [],
  })


  InsertNodeIntoTrie<TestData>(testTrie, "/cats", "CATS")

  expect(testTrie).toEqual({
    text: "/",
    nodes: [
      {
        text: "super",
        data: "SUPER",
      },
      {
        text: "cats",
        data: "CATS",
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
