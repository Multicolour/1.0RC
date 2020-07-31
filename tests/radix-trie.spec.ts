import naughtyStrings from "naughty-string-validator"
import {
  getPrefixLengthFromNode,
  breakPathIntoComponents,
  Node,
  InsertNodeIntoTrie,
  CreateTrie,
  SearchTrie,
  URI,
  RemoveNodeFromTrie,
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
      expect(getPrefixLengthFromNode({ text }, naughtyString)).toEqual(
        text.length,
      )
    })
})

test("Emoji string prefix check", () => {
  naughtyStrings
    .getEmojiList()
    .filter(Boolean)
    .map((naughtyString: string): void => {
      const text = escape(naughtyString)
      expect(getPrefixLengthFromNode({ text }, naughtyString)).toEqual(
        text.length,
      )
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

let testTrie: Node<TestData> = CreateTrie<TestData>()
/*naughtyStrings
  .getEmojiList()
  .filter(Boolean)
  .slice(0, 500) // There are a lot more than this but lets be kind to CI.
  .map((naughtyString: string, index): void => {
    test("Naughty strings - Emoji " + index, () => {
      InsertNodeIntoTrie(testTrie, { uri: naughtyString }, naughtyString)
      expect(testTrie).toMatchSnapshot()
    })
  })*/

testTrie = CreateTrie<TestData>()
naughtyStrings
  .getNaughtyStringList()
  .filter(Boolean)
  // There are lots and lots here, snapshot got too big
  .splice(0, 500)
  .map((naughtyString: string, index): void => {
    test("Naughty strings - Naughty string " + index, () => {
      const escapedNaughtyString = escape(naughtyString)
      InsertNodeIntoTrie(
        testTrie,
        { uri: escapedNaughtyString },
        escapedNaughtyString,
      )
      expect(testTrie).toMatchSnapshot()
    })
  })

testTrie = CreateTrie<TestData>()
InsertNodeIntoTrie<TestData>(testTrie, URIs.super, "SUPER")
InsertNodeIntoTrie<TestData>(testTrie, URIs.sucky, "SUCKY")
InsertNodeIntoTrie<TestData>(testTrie, URIs.cats, "CATS")
InsertNodeIntoTrie<TestData>(testTrie, URIs.pyjamas, "PJs!")
test("Search /cats", () => {
  expect(
    SearchTrie<TestData>(testTrie, { uri: "/cats" }),
  ).toEqual({
    text: "cats",
    data: "CATS",
    nodes: [
      {
        text: "/pyjamas",
        data: "PJs!",
        nodes: [],
      },
    ],
  })
})

test("Search /super", () => {
  expect(
    SearchTrie<TestData>(testTrie, { uri: "/super" }),
  ).toEqual({
    text: "per",
    data: "SUPER",
    nodes: [],
  })
})

test("Search /sucky", () => {
  expect(
    SearchTrie<TestData>(testTrie, { uri: "/sucky" }),
  ).toEqual({
    text: "cky",
    data: "SUCKY",
    nodes: [],
  })
})

test("Search /404", () => {
  expect(
    SearchTrie<TestData>(testTrie, { uri: "/404" }),
  ).toBe(undefined)
})

test("Delete pyjamas", () => {
  const testTrie = CreateTrie<TestData>()
  InsertNodeIntoTrie<TestData>(testTrie, URIs.super, "SUPER")
  InsertNodeIntoTrie<TestData>(testTrie, URIs.sucky, "SUCKY")
  InsertNodeIntoTrie<TestData>(testTrie, URIs.cats, "CATS")
  InsertNodeIntoTrie<TestData>(testTrie, URIs.pyjamas, "PJs!")
  RemoveNodeFromTrie(testTrie, URIs.pyjamas)

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
