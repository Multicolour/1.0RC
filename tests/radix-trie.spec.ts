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
    uri: escape("/no leading slash"),
  })
  expect(breakPathIntoComponents("/")).toEqual({ uri: "/" })
  expect(breakPathIntoComponents("/:animal")).toEqual({
    uri: escape("/:animal"),
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
    uri: escape("/:animal/:says"),
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
    .map((naughtyString: string): void => {
      const text = escape(naughtyString)
      console.log(JSON.stringify(text))
      expect(getPrefixLengthFromNode({ text }, text)).toEqual(text.length)
    })
})

test("Emoji string prefix check", () => {
  naughtyStrings
    .getEmojiList()
    .filter(Boolean)
    .map((naughtyString: string): void => {
      const text = escape(naughtyString)
      expect(getPrefixLengthFromNode({ text }, text)).toEqual(text.length)
    })
})

test("Parameterised prefix check", () => {
  expect(getPrefixLengthFromNode({ text: "/a/:a" }, "/a/aanteater")).toEqual(12)
  expect(getPrefixLengthFromNode({ text: "/a/:animal" }, "/a/cat")).toEqual(6)
})

const URIs: Record<string, URI> = {
  super: breakPathIntoComponents("/super"),
  sucky: breakPathIntoComponents("/sucky"),
  cats: breakPathIntoComponents("/cats"),
  pyjamas: breakPathIntoComponents("/cats/pyjamas"),
}

test("Insert one node", () => {
  const testTrie: Node<TestData> = CreateTrie<TestData>()
  InsertNodeIntoTrie<TestData>(testTrie, URIs.super, "SUPER")

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

test("Insert two nodes", () => {
  const testTrie: Node<TestData> = CreateTrie<TestData>()
  InsertNodeIntoTrie<TestData>(testTrie, URIs.super, "SUPER")
  InsertNodeIntoTrie<TestData>(testTrie, URIs.sucky, "SUCKY")

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

test("Insert three nodes", () => {
  const testTrie: Node<TestData> = CreateTrie<TestData>()
  InsertNodeIntoTrie<TestData>(testTrie, URIs.super, "SUPER")
  InsertNodeIntoTrie<TestData>(testTrie, URIs.sucky, "SUCKY")
  InsertNodeIntoTrie<TestData>(testTrie, URIs.cats, "CATS")

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

test("Insert four nodes", () => {
  const testTrie: Node<TestData> = CreateTrie<TestData>()
  InsertNodeIntoTrie<TestData>(testTrie, URIs.super, "SUPER")
  InsertNodeIntoTrie<TestData>(testTrie, URIs.sucky, "SUCKY")
  InsertNodeIntoTrie<TestData>(testTrie, URIs.cats, "CATS")
  InsertNodeIntoTrie<TestData>(testTrie, URIs.pyjamas, "PJs!")

  //console.log(JSON.stringify(testTrie, null, 2))

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
                data: "PJs!",
                nodes: [],
              },
            ],
          },
        ],
      },
    ],
  })
})

const testTrie: Node<TestData> = CreateTrie<TestData>()
naughtyStrings
  .getEmojiList()
  .filter(Boolean)
  .splice(0, 10)
  .map((naughtyString: string): void => {
    test("Naughty strings", () => {
      InsertNodeIntoTrie(testTrie, { uri: naughtyString }, naughtyString)
      // console.log(JSON.stringify(testTrie, null, 2))
      expect(testTrie).toMatchSnapshot()
    })
  })

/*
testTrie = CreateTrie<TestData>()
naughtyStrings
  .getNaughtyStringList()
  .filter(Boolean)
  .map((naughtyString: string): void => {
    test("Naughty strings", () => {
      InsertNodeIntoTrie(testTrie, { uri: naughtyString }, naughtyString)
      expect(testTrie).toMatchSnapshot()
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
