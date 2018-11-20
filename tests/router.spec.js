const Router = require("../lib/server/router")
const { METHODS } = require("http")

test("Router starts and radix trie searches are performant", () => {
  const router = new Router()
  const noOp = async() => {}

  router.get({
    path: "/user", 
    handler: noOp,
  })

  router.get({
    path: "/usurper", 
    handler: noOp,
  })
  
  expect(router.tries.GET.path).toEqual("/us")
  expect(router.tries.GET.children.length).toEqual(2)
  expect(router.tries.GET.children[0].path).toEqual("er")
  expect(router.tries.GET.children[1].path).toEqual("urper")
})
