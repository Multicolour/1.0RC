const Router = require("../lib/server/router")
const { METHODS } = require("http")

test("Router starts and radix trie searches are performant", () => {
  const router = new Router()
  const noOp = async() => {}

  const routes = [
    {
      path: "/user", 
      handler: noOp,
    },
    {
      path: "/usurper", 
      handler: noOp,
    },
    {
      path: "/user/:userId",
      handler: noOp,
    },
    {
      path: "/usurper/*name",
      handler: noOp,
    },
  ]

  // Route everything.
  routes.forEach(route => {
    METHODS.forEach(method => {
      if (router[method.toLowerCase()]) 
        router[method.toLowerCase()](route)
    })
  })
  
  // Do some basic tests on the resulting structure.
  expect(router.tries.GET.path).toEqual("/us")
  expect(router.tries.GET.children.length).toEqual(2)
  expect(router.tries.GET.children[0].path).toEqual("er")
  expect(router.tries.GET.children[1].path).toEqual("urper")

  // Test some of the parametric uris
  expect(router.match("GET", "/user/123")).toEqual({
    path: "/user/:userId",
    handler: noOp,
    params: [
      {
        key: "userId",
        value: "123",
      },
    ],
  })
  
  expect(router.match("GET", "/usurper/dave-mackintosh")).toEqual({
    path: "/usurper/*name",
    handler: noOp,
    params: [
      {
        key: "name",
        value: "/dave-mackintosh",
      },
    ],
  })
})
