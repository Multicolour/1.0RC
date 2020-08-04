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
  DefaultParams,
} from "@lib/server/radix-trie"

type Handler = (
  request: Request,
  response: Response,
) => Promise<Record<string, string>>
type TestData = string
const URIs: Record<string, URI<DefaultParams>> = {
  super: breakPathIntoComponents<DefaultParams>("/super"),
  sucky: breakPathIntoComponents<DefaultParams>("/sucky"),
  cats: breakPathIntoComponents<DefaultParams>("/cats"),
  catsSay: breakPathIntoComponents<DefaultParams>("/cats/meow"),
  catsWakeMe: breakPathIntoComponents<DefaultParams>("/cats/meow/in-the-night"),
  pyjamas: breakPathIntoComponents<DefaultParams>("/cats/pyjamas"),
  animal: breakPathIntoComponents<DefaultParams>("/:animal/:says"),
} as const

describe("URI object", () => {
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
        animal: null,
      },
    })
    expect(breakPathIntoComponents("/animal")).toEqual({
      uri: "/animal",
    })
    expect(breakPathIntoComponents("/:animal/:says")).toEqual({
      uri: escape("/:animal/:says"),
      params: {
        animal: null,
        says: null,
      },
    })
  })
})

describe("Prefix length", () => {
  test("Basic Prefix lengths", () => {
    expect(getPrefixLengthFromNode((null as unknown) as Node, "text")).toEqual(
      0,
    )
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
    expect(getPrefixLengthFromNode({ text: "/a/:a" }, "/a/aanteater")).toEqual(
      12,
    )
    expect(getPrefixLengthFromNode({ text: "/a/:animal" }, "/a/cat")).toEqual(6)
  })
})

describe("Insert nodes", () => {
  test("Insert first node", () => {
    const testTrie = CreateTrie<TestData>()
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

  test("Insert second node", () => {
    const testTrie = CreateTrie<TestData>()
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

  test("Insert third node", () => {
    const testTrie = CreateTrie<TestData>()
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

  test("Insert fourth node", () => {
    const testTrie = CreateTrie<TestData>()
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

  test("Insert extra nodes", () => {
    const testTrie = CreateTrie<TestData>()
    InsertNodeIntoTrie<TestData>(testTrie, URIs.super, "SUPER")
    InsertNodeIntoTrie<TestData>(testTrie, URIs.sucky, "SUCKY")
    InsertNodeIntoTrie<TestData>(testTrie, URIs.cats, "CATS")
    InsertNodeIntoTrie<TestData>(testTrie, URIs.pyjamas, "PJs!")
    InsertNodeIntoTrie<TestData>(testTrie, URIs.catsSay, "meow")
    InsertNodeIntoTrie<TestData>(testTrie, URIs.catsWakeMe, "LOUD NOISES")

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
                  text: "/",
                  nodes: [
                    {
                      text: "pyjamas",
                      data: "PJs!",
                      nodes: [],
                    },
                    {
                      text: "meow",
                      data: "meow",
                      nodes: [
                        {
                          text: "/in-the-night",
                          data: "LOUD NOISES",
                          nodes: [],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    })
  })
})

describe("Insert parametric route", () => {
  const testTrie = CreateTrie<null>()

  InsertNodeIntoTrie<null>(testTrie, URIs.animal, null)
  console.log(JSON.stringify(testTrie, null, 2))
})

describe("Search trie", () => {
  let testTrie = CreateTrie<TestData>()
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
})

describe("Delete from trie and recompress", () => {
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
})

describe("lifecycle of a trie node", () => {
  const testTrie = CreateTrie<TestData>()

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

  expect(SearchTrie(testTrie, URIs.super)).toEqual({
    text: "/super",
    data: "SUPER",
    nodes: [],
  })

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

  expect(SearchTrie<TestData>(testTrie, URIs.sucky)).toEqual({
    text: "cky",
    data: "SUCKY",
    nodes: [],
  })

  RemoveNodeFromTrie<TestData>(testTrie, URIs.sucky)

  expect(SearchTrie(testTrie, URIs.super)).toEqual({
    text: "/super",
    data: "SUPER",
    nodes: [],
  })
})

describe("real world setup", () => {
  const handler = jest.fn() as Handler
  const testTrie = CreateTrie()
  const routes: [string, Handler][] = [
    ["/session", handler],
    ["/session/facebook", handler],
    ["/session/twitter", handler],
    ["/user", handler],
    ["/user/projects", handler],
    ["/user/account", handler],
  ]

  routes.forEach((route) =>
    InsertNodeIntoTrie(testTrie, { uri: route[0] }, route[1]),
  )

  expect(testTrie).toEqual({
    text: "",
    nodes: [
      {
        text: "/",
        nodes: [
          {
            text: "session",
            data: handler,
            nodes: [
              {
                text: "/",
                nodes: [
                  {
                    text: "facebook",
                    data: handler,
                    nodes: [],
                  },
                  {
                    text: "twitter",
                    data: handler,
                    nodes: [],
                  },
                ],
              },
            ],
          },
          {
            text: "user",
            data: handler,
            nodes: [
              {
                text: "/",
                nodes: [
                  {
                    text: "projects",
                    data: handler,
                    nodes: [],
                  },
                  {
                    text: "account",
                    data: handler,
                    nodes: [],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  })
})
