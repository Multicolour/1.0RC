import naughtyStrings from "naughty-string-validator"
import {
  getPrefixLengthFromNode,
  breakPathIntoComponents,
} from "@lib/server/radix-trie"

test("URI object from path", () => {
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
  expect(getPrefixLengthFromNode({ text: "text" }, "text")).toEqual(4)
  expect(getPrefixLengthFromNode({ text: "multicolour" }, "multi")).toEqual(5)
  expect(getPrefixLengthFromNode({ text: "a.b.c.d" }, "a.b.c")).toEqual(5)
  expect(getPrefixLengthFromNode({ text: "1" }, "1")).toEqual(1)
  expect(getPrefixLengthFromNode({ text: "/a/cat" }, "/cat")).toEqual(1)
})

test("Naughty strings prefix check", () => {
  naughtyStrings
    .getNaughtyStringList()
    .map((naughtyString: string): void =>
      expect(
        getPrefixLengthFromNode({ text: naughtyString }, naughtyString),
      ).toEqual(naughtyString.length),
    )
})

test("Emoji string prefix check", () => {
  naughtyStrings
    .getEmojiList()
    .map((naughtyString: string): void =>
      expect(
        getPrefixLengthFromNode({ text: naughtyString }, naughtyString),
      ).toEqual(naughtyString.length),
    )
})

test("Parameterised prefix check", () => {
  expect(getPrefixLengthFromNode({ text: "/a/:animal" }, "/a/cat")).toEqual(6)
})
/*test("Insert first node", () => {
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
  console.log(JSON.stringify(testTrie, null, 2))

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
*/
