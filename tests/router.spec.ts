import PrettyErrorWithStack from "@lib/better-errors/pretty-error-with-stack"
import Router from "@lib/server/router"
import {
  Multicolour$Route,
  Multicolour$RouteVerbs,
} from "@mc-types/multicolour/route"

test("Router starts and routing", () => {
  const router = new Router()
  const noOp = async () => Promise.resolve()

  const routes: Multicolour$Route[] = [
    {
      path: "/user",
      method: Multicolour$RouteVerbs.GET,
      handler: noOp,
    },
    {
      path: "/usurper",
      method: Multicolour$RouteVerbs.GET,
      handler: noOp,
    },
    {
      path: "/user/:userId",
      method: Multicolour$RouteVerbs.GET,
      handler: noOp,
    },
    {
      path: "/usurper/*name",
      method: Multicolour$RouteVerbs.GET,
      handler: noOp,
    },
  ]

  routes.forEach((route: Multicolour$Route) => {
    router.GET(route)
  })

  // Do some basic tests on the resulting structure.
  expect(router.tries.GET.path).toEqual("/us")
  expect(router.tries.GET.children.length).toEqual(2)
  expect(router.tries.GET.children[0].path).toEqual("er")
  expect(router.tries.GET.children[1].path).toEqual("urper")

  // Test some of the parametric uris
  expect(router.match(Multicolour$RouteVerbs.GET, "/user/123")).toEqual({
    handle: noOp,
    params: [
      {
        key: "userId",
        value: "123",
      },
    ],
  })

  expect(router.match(Multicolour$RouteVerbs.GET, "/usurper/dave-mackintosh")).toEqual({
    handle: noOp,
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
    router.GET({
      path: "/*conflict",
      method: Multicolour$RouteVerbs.GET,
      handler: noOp,
    })
    router.GET({
      path: "/*conflict",
      method: Multicolour$RouteVerbs.GET,
      handler: noOp,
    })
  }).toThrow(PrettyErrorWithStack)

  // Conflicting wildcard and static paths
  expect(() => {
    const router = new Router()
    router.GET({
      path: "/*/errorPlease",
      method: Multicolour$RouteVerbs.GET,
      handler: noOp,
    })
    router.GET({
      path: "/cant/do/error",
      method: Multicolour$RouteVerbs.GET,
      handler: noOp,
    })
  }).toThrow(PrettyErrorWithStack)

  // The "what are you tryna do"
  expect(() => {
    const router = new Router()
    router.GET({
      path: "/*/cant*/do/this",
      method: Multicolour$RouteVerbs.GET,
      handler: noOp,
    })
  }).toThrow(PrettyErrorWithStack)

  // This isn't glob.
  expect(() => {
    const router = new Router()
    router.GET({
      path: "/**",
      method: Multicolour$RouteVerbs.GET,
      handler: noOp,
    })
  }).toThrow(PrettyErrorWithStack)

  // Param without a name...
  expect(() => {
    const router = new Router()
    router.GET({
      path: "/:",
      method: Multicolour$RouteVerbs.GET,
      handler: noOp,
    })
  }).toThrow(PrettyErrorWithStack)

  // Wildcard without a name
  expect(() => {
    const router = new Router()
    router.GET({
      path: "*",
      method: Multicolour$RouteVerbs.GET,
      handler: noOp,
    })
  }).toThrow(PrettyErrorWithStack)

  // Conflicting param and wildcard paths.
  expect(() => {
    const router = new Router()
    router.GET({
      path: "/:param",
      method: Multicolour$RouteVerbs.GET,
      handler: noOp,
    })
    router.GET({
      path: "/*test",
      method: Multicolour$RouteVerbs.GET,
      handler: noOp,
    })
  }).toThrow(PrettyErrorWithStack)

  expect((() => {
    const router = new Router()
    let string = ""

    try {
      router.GET({
        path: "/test",
      method: Multicolour$RouteVerbs.GET,
        handler: noOp,
      })
      router.GET({
        path: "/test",
      method: Multicolour$RouteVerbs.GET,
        handler: noOp,
      })
    } catch (error) {
      string = error.prettify()
    }

    return string
  })()).toContain("A handle is already registered for path '/test'")

  // This appears to be an internal method but it's
  // ran here because of test coverage...
  expect(router.tries.GET.addPriority(1)).toBe(0)
})
