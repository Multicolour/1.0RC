import naughtyStrings from "naughty-string-validator"
import {
  getPrefixLengthFromNode,
  breakPathIntoComponents,
  Node,
  InsertNodeIntoTrie,
  CreateTrie,
  URI,
} from "@lib/server/radix-trie"

type TestData = string

test("URI object from path", () => {
  expect(breakPathIntoComponents((true as unknown) as string)).toEqual({
    uri: "",
  })
  expect(breakPathIntoComponents("no leading slash")).toEqual({
    uri: "/no leading slash",
  })
  expect(breakPathIntoComponents("/")).toEqual({ uri: "/" })
  expect(breakPathIntoComponents("/:animal")).toEqual({
    uri: "/:animal",
    params: {
      animal: {
        start: 1,
        end: 6,
      },
    },
  })
  expect(breakPathIntoComponents("/animal")).toEqual({
    uri: "/animal",
  })
  expect(breakPathIntoComponents("/:animal/:says")).toEqual({
    uri: "/:animal/:says",
    params: {
      animal: {
        start: 1,
        end: 6,
      },
      says: {
        start: 9,
        end: 12,
      },
    },
  })
})

test("Basic Prefix lengths", () => {
  expect(getPrefixLengthFromNode((null as unknown) as Node, "text")).toEqual(0)
  expect(getPrefixLengthFromNode({ text: "text" }, "text")).toEqual(4)
  expect(getPrefixLengthFromNode({ text: "multicolour" }, "multi")).toEqual(5)
  expect(getPrefixLengthFromNode({ text: "a.b.c.d" }, "a.b.c")).toEqual(5)
  expect(getPrefixLengthFromNode({ text: "1" }, "1")).toEqual(1)
  expect(getPrefixLengthFromNode({ text: "/a/cat" }, "/cat")).toEqual(1)
})

test("Naughty strings prefix check", () => {
  naughtyStrings
    .getNaughtyStringList()
    .filter(Boolean)
    .map((naughtyString: string): void =>
      expect(
        getPrefixLengthFromNode({ text: naughtyString }, naughtyString),
      ).toEqual(naughtyString.length),
    )
})

test("Emoji string prefix check", () => {
  naughtyStrings
    .getEmojiList()
    .filter(Boolean)
    .map((naughtyString: string): void =>
      expect(
        getPrefixLengthFromNode({ text: naughtyString }, naughtyString),
      ).toEqual(naughtyString.length),
    )
})

test("Parameterised prefix check", () => {
  expect(getPrefixLengthFromNode({ text: "/a/:a" }, "/a/aanteater")).toEqual(12)
  expect(getPrefixLengthFromNode({ text: "/a/:animal" }, "/a/cat")).toEqual(6)
})

const testTrie: Node<TestData> = CreateTrie<TestData>()

test("Insert first node", () => {
  const uri: URI = breakPathIntoComponents("/super")
  InsertNodeIntoTrie<TestData>(testTrie, uri, "SUPER")

  expect(testTrie).toEqual({
    text: "",
    nodes: [
      {
        text: "/super",
        data: "SUPER",
        nodes: [],
      },
    ],
  })
})

test("Insert second node", () => {
  const uri: URI = breakPathIntoComponents("/sucky")
  InsertNodeIntoTrie<TestData>(testTrie, uri, "SUCKY")

  expect(testTrie).toEqual({
    text: "",
    nodes: [
      {
        text: "/su",
        nodes: [
          {
            text: "per",
            data: "SUPER",
            nodes: [],
          },
          {
            text: "cky",
            data: "SUCKY",
            nodes: [],
          },
        ],
      },
    ],
  })
})

test("Insert third, unrelated node", () => {
  const uri: URI = breakPathIntoComponents("/cats")
  InsertNodeIntoTrie<TestData>(testTrie, uri, "CATS")

  expect(testTrie).toEqual({
    text: "",
    nodes: [
      {
        text: "/",
        nodes: [
          {
            text: "su",
            data: undefined,
            nodes: [
              {
                text: "per",
                data: "SUPER",
                nodes: [],
              },
              {
                text: "cky",
                data: "SUCKY",
                nodes: [],
              },
            ],
          },
          {
            text: "cats",
            data: "CATS",
            nodes: [],
          },
        ],
      },
    ],
  })
})

test("Insert fourth node", () => {
  const uri: URI = breakPathIntoComponents("/cats/pyjamas")
  InsertNodeIntoTrie<TestData>(testTrie, uri, "PJs!")

  expect(testTrie).toEqual({
    text: "",
    nodes: [
      {
        text: "/",
        nodes: [
          {
            text: "su",
            data: undefined,
            nodes: [
              {
                text: "per",
                data: "SUPER",
                nodes: [],
              },
              {
                text: "cky",
                data: "SUCKY",
                nodes: [],
              },
            ],
          },
          {
            text: "cats",
            data: "CATS",
            nodes: [
              {
                text: "/pyjamas",
                data: "PJs",
                nodes: [],
              },
            ],
          },
        ],
      },
    ],
  })
})
/*
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
*/
