import Router from "../lib/server/router"
import { Multicolour$RouteVerbs } from "@mc-types/multicolour/route"
import RouterError from "../lib/better-errors/router-error"

test("Router starts and routing", () => {
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
    METHODS.forEach((method: string) => {
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

  // Conflicting paths
  expect(() => {
    const router = new Router()
    router.get({
      path: "/*conflict",
      handler: noOp,
    })
    router.get({
      path: "/*conflict",
      handler: noOp,
    })
  }).toThrow(RouterError)

  // Conflicting wildcard and static paths
  expect(() => {
    const router = new Router()
    router.get({
      path: "/*/errorPlease",
    })
    router.get({
      path: "/cant/do/error",
    })
  }).toThrow(RouterError)
  
  // The "what are you tryna do"
  expect(() => {
    const router = new Router()
    router.get({
      path: "/*/cant*/do/this",
    })
  }).toThrow(RouterError)
  
  // This isn't glob.
  expect(() => {
    const router = new Router()
    router.get({
      path: "/**",
    })
  }).toThrow(RouterError)
  
  // Param without a name...
  expect(() => {
    const router = new Router()
    router.get({
      path: "/:",
    })
  }).toThrow(RouterError)
  
  // Wildcard without a name
  expect(() => {
    const router = new Router()
    router.get({
      path: "*",
    })
  }).toThrow(RouterError)
  
  // Conflicting param and wildcard paths.
  expect(() => {
    const router = new Router()
    router.get({
      path: "/:param",
    })
    router.get({
      path: "/*test",
    })
  }).toThrow(RouterError)

  expect((() => {
    const router = new Router()
    let string = ""

    try {
      router.get({ path: "/test" })
      router.get({ path: "/test" })
    }
    catch(error) {
      string = error.prettify()
    }

    return string
  })()).toContain("A handle is already registered for path '/test'")

  // This appears to be an internal method but it's 
  // ran here because of test coverage... 
  expect(router.tries.GET.addPriority(1)).toBe(0)
})
