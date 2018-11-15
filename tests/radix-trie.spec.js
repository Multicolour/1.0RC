const RadixTrie = require("../lib/server/radix-trie")

test("Radix tree generator", () => {
  const routes = [
    {
      path: "/login",
      handler: () => {},
    },
    {
      path: "/user",
      handler: () => {},
    },
    {
      path: "/user/catalog",
      handler: () => {},
    },
    {
      path: "/user/settings/account",
      handler: () => {},
    },
  ]

  const expectedRadixTrie = {
    branches: [
      {
        path: "login",
        children: [],
        handler: () => {},
      },
      {
        path: "user",
        handler: () => {},
        children: [
          {
            path: "catalog",
            handler: () => {},
            children: [],
          },
          {
            path: "settings",
            handler: null,
            children: [
              {
                path: "account",
                handler: () => {},
                children: [],
              },
            ],
          },
        ],
      },
    ],
  }

  const multicolourRadix = new RadixTrie(routes)

  expect(multicolourRadix.trie).toBe(expectedRadixTrie)
})
