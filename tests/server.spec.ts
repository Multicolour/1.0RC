import HttpError from "@lib/better-errors/http-error"
import MulticolourServer from "@lib/server/server"
import { Multicolour$RouteVerbs } from "@mc-types/multicolour/route"
import { ServerResponse } from "http"
import { IncomingMessage } from "./mocks/http"


const testableRoutes = [
  {
    headers: {
      accept: "text/plain",
    },
    route: {
      method: Multicolour$RouteVerbs.GET,
      path: "/text",
      handler: async () => "Text",
    },
    expected: (reply: any, response: ServerResponse) => {
      expect(reply).toBe("Text")
      expect(response.getHeader("content-type")).toBe("text/plain")
    },
  },
  {
    headers: {
      accept: "application/json",
    },
    route: {
      method: Multicolour$RouteVerbs.GET,
      path: "/json",
      handler: async () => ({ json: true }),
    },
    expected: (reply: any, response: ServerResponse) => {
      expect(reply).toEqual({ json: true })
      expect(response.getHeader("content-type")).toBe("application/json")
    },
  },
  {
    headers: {
      accept: "application/json",
    },
    route: {
      method: Multicolour$RouteVerbs.GET,
      path: "/throws-http-error",
      handler: async () => {
        throw new HttpError({
          statusCode: 418,
          error: {
            message: "Some kind of error.",
          },
        })
      },
    },
    expected: (reply: any, response: ServerResponse) => {
      expect(reply).toEqual({
        statusCode: 418,
        error: {
          message: "Some kind of error.",
        },
      })
      expect(response.statusCode).toBe(418)
      expect(response.getHeader("content-type")).toBe("application/json")
    },
  },
]

test("Multicolour server routing", async () => {
  const server = new MulticolourServer({
    type: "api",
  })

  for await (const testableRoute of testableRoutes) {
    server.route(testableRoute.route)
    const request = new IncomingMessage({
      url: testableRoute.route.path,
      method: testableRoute.route.method.toUpperCase(),
      headers: testableRoute.headers,
    })
    const testableResponse = new ServerResponse(request)

    const reply = await server.onRequest(request, testableResponse)

    await testableRoute.expected(reply, testableResponse)
  }

})

test("404 for unknown route", () => {
  const server = new MulticolourServer({
    type: "api",
  })
  const request = new IncomingMessage({
    url: "/nope",
    method: Multicolour$RouteVerbs.GET,
  })
  const response = new ServerResponse(request)
  server.onRequest(request, response)
    .then(() => {
      expect(response.statusCode).toBe(404)
      expect(response.statusCode).not.toBe(500)
    })
})

test("Server content negotiator", () => {
  const server = new MulticolourServer({
    type: "api",
  })
  const classNegotiator = class {
    public async parseBody() {
      return Promise.resolve("")
    }
  }

  server.addContentNegotiator("text/html", classNegotiator)

  expect(server.negotiators["text/html"]).toBeTruthy()
})
