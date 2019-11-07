import {
  CreateTrie,
  InsertNodeIntoTrie,
  NodeType,
  SearchTrie,
} from "@lib/server/radix-trie"

type TestData = string

const testTrie = CreateTrie<TestData>()

test("Insert first node", () => {
  InsertNodeIntoTrie<TestData>(testTrie, "/super", "SUPER")
  expect(testTrie).toEqual({
    text: "",
    type: NodeType.ROOT,
    nodes: [
      {
        text: "/super",
        data: "SUPER",
        type: NodeType.END,
      },
    ],
  })
})

test("Insert second node", () => {
  InsertNodeIntoTrie<TestData>(testTrie, "/sucky", "SUCKY")

  expect(testTrie).toEqual({
    text: "",
    type: NodeType.ROOT,
    nodes: [
      {
        text: "/su",
        type: NodeType.PLAIN,
        nodes: [
          {
            text: "per",
            data: "SUPER",
            type: NodeType.END,
          },
          {
            text: "cky",
            data: "SUCKY",
            type: NodeType.END,
          },
        ],
      },
    ],
  })
})

test("Insert third, unrelated node", () => {
  InsertNodeIntoTrie<TestData>(testTrie, "/cats", "CATS")
  console.log(3, JSON.stringify(testTrie, null, 2))

  expect(testTrie).toEqual({
    text: "",
    type: NodeType.ROOT,
    nodes: [
      {
        text: "/",
        type: NodeType.PLAIN,
        nodes: [
          {
            text: "su",
            type: NodeType.PLAIN,
            nodes: [
              {
                text: "per",
                data: "SUPER",
                type: NodeType.END,
              },
              {
                text: "cky",
                data: "SUCKY",
                type: NodeType.END,
              },
            ],
          },
          {
            text: "cats",
            data: "CATS",
            type: NodeType.END,
          },
        ],
      },
    ],
  })
})

test("Insert fourth node", () => {
  InsertNodeIntoTrie<TestData>(testTrie, "/cats/pyjamas", "PJs!")
  console.log(4, JSON.stringify(testTrie, null, 2))

  expect(testTrie).toEqual({
    text: "",
    type: NodeType.ROOT,
    nodes: [
      {
        text: "/",
        type: NodeType.PLAIN,
        nodes: [
          {
            text: "su",
            type: NodeType.PLAIN,
            nodes: [
              {
                text: "per",
                data: "SUPER",
                type: NodeType.END,
              },
              {
                text: "cky",
                data: "SUCKY",
                type: NodeType.END,
              },
            ],
          },
          {
            text: "cats",
            data: "CATS",
            type: NodeType.END,
            nodes: [
              {
                text: "/pyjamas",
                data: "PJs",
                type: NodeType.END,
              },
            ],
          },
        ],
      },
    ],
  })
})

test("Search /cats", () => {
  expect(SearchTrie<TestData>(testTrie, "/cats")).toEqual({
    text: "cats",
    data: "CATS",
    type: NodeType.END,
  })
})

test("Search /super", () => {
  expect(SearchTrie<TestData>(testTrie, "/super")).toEqual({
    text: "per",
    data: "SUPER",
    type: NodeType.END,
  })
})

test("Search /sucky", () => {
  expect(SearchTrie<TestData>(testTrie, "/sucky")).toEqual({
    text: "cky",
    data: "SUCKY",
    type: NodeType.END,
  })
})

test("Search /404", () => {
  expect(SearchTrie<TestData>(testTrie, "/404")).toBe(undefined)
})
