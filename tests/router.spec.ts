import PrettyErrorWithStack from "@lib/better-errors/pretty-error-with-stack"
import Router from "@lib/server/router"
import {
  MulticolourRoute,
  MulticolourRouteVerbs,
} from "@mc-types/multicolour/route"

type Route = MulticolourRoute<Record<string, unknown>>

test("Router starts and routing", () => {
  const router = new Router()
  const noOp = async (): Promise<Record<string, unknown>> => Promise.resolve({})

  const routes: Route[] = [
    {
      path: "/user",
      method: MulticolourRouteVerbs.GET,
      handler: noOp,
    },
    {
      path: "/usurper",
      method: MulticolourRouteVerbs.GET,
      handler: noOp,
    },
    {
      path: "/user/:userId",
      method: MulticolourRouteVerbs.GET,
      handler: noOp,
    },
  ]

  routes.forEach((route: Route) => {
    router.GET(route)
  })

  // Test some of the parametric uris
  expect(router.match(MulticolourRouteVerbs.GET, "/user/123")).toEqual({
    handle: noOp,
    params: {
      userId: 123,
    },
  })

  expect(
    router.match(MulticolourRouteVerbs.GET, "/usurper/dave-mackintosh"),
  ).toEqual({
    handle: noOp,
    params: {
      name: "dave-mackintosh",
    },
  })

  // Param without a name...
  expect(() => {
    const router = new Router()
    router.GET({
      path: "/:",
      method: MulticolourRouteVerbs.GET,
      handler: noOp,
    })
  }).toThrow(PrettyErrorWithStack)

  // Conflicting param and wildcard paths.
  expect(() => {
    const router = new Router()
    router.GET({
      path: "/:param",
      method: MulticolourRouteVerbs.GET,
      handler: noOp,
    })
  }).toThrow(PrettyErrorWithStack)

  expect(() => {
    const router = new Router()

    router.GET({
      path: "/test",
      method: MulticolourRouteVerbs.GET,
      handler: noOp,
    })
  }).toThrow(PrettyErrorWithStack)
})
