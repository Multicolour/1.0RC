const RadixTrie = require("../lib/server/radix-trie")

test("Radix tree generator", () => {
  const routes = [
    {
      path: "/user",
      handler: async() => {},
    },
    {
      path: "/product",
      handler: async() => {},
    },
    {
      path: "/user/settings/account",
      handler: async() => {},
    },
    {
      path: "/product/:productId",
      handler: async() => {},
    },
    {
      path: "/product/:productId/categories",
      handler: async() => {},
    },
    {
      path: "/product/:productId/categories/:categoryId",
      handler: async() => {},
    },
    {
      path: "/user/password/:token",
      handler: async() => {},
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
          {
            path: ":token",
            handler: () => {},
            children: [],
          },
        ],
      },
    ],
  }

  const multicolourRadix = new RadixTrie(routes)

  expect(multicolourRadix.trie).toBe(expectedRadixTrie)
})
