const RadixTrie = require("../lib/server/radix-trie")

test("Radix tree generator", () => {
  const routes = [
    {
      path: "/user",
      handler: async() => {},
    },
    {
      path: "/usable",
      handler: async() => {},
    },
    {
      path: "/usurper",
      handler: async() => {},
    },
    {
      path: "/user/settings/account",
      handler: async() => {},
    },
    {
      path: "/user/password/:token",
      handler: async() => {},
    },
  ]

  const expectedRadixTrie =
    [
      {
        path: "login",
        children: [],
        handler: async() => {},
      },
      {
        path: "us",
        handler: null,
        children: [
          {
            path: "er",
            handler: async() => {},
            children: [
              {
                path: "settings",
                handler: null,
                children: {
                  path: "account",
                  handler: async() => {},
                  children: [],
                },
              },
              {
                path: "password",
                handler: null,
                children: [
                  {
                    path: ":token",
                    handler: async() => {},
                    children: [],
                  },
                ],
              },
            ],
          },
          {
            path: "urper",
            handler: async() => {},
            children: [],
          },
          {
            path: "able",
            handler: async() => {},
            children: [],
          },
        ],
      },
    ]

  const multicolourRadix = new RadixTrie(routes)

  expect(multicolourRadix.trie).toBe(expectedRadixTrie)
})
