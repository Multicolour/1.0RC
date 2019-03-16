import {
  IncomingMessage,
  ServerResponse, 
} from "./mocks/http"

import MulticolourServer from "@lib/server/server"
import HttpError from "@lib/better-errors/http-error"

const testableRoutes = [
  {
    headers: {
      accept: "text/plain",
    },
    route: {
      method: "get",
      path: "/text",
      handler: async() => "Text",
    },
    expected: (reply: string, response: ServerResponse) => {
      console.log(response)
      expect(reply).toBe("Text")
      expect(response.headers["content-type"]).toBe("text/plain")
    },
  },
  {
    headers: {
      accept: "application/json",
    },
    route: {
      method: "get",
      path: "/json",
      handler: async() => ({ json: true }),
    },
    expected: (reply: object, response: ServerResponse) => {
      expect(reply).toEqual({ json: true })
      expect(response.headers["content-type"]).toBe("application/json")
    },
  },
  {
    headers: {
      accept: "application/json",
    },
    route: {
      method: "get",
      path: "/throws-http-error",
      handler: async() => {
        throw new HttpError({
          statusCode: 418,
          error: {
            message: "Some kind of error.",
          },
        })
      },
    },
    expected: (reply: object, response: ServerResponse) => {
      expect(reply).toEqual({
        statusCode: 418,
        error: {
          message: "Some kind of error.",
        },
      })
      expect(response.statusCode).toBe(418)
      expect(response.headers["content-type"]).toBe("application/json")
    },
  },
]

test("Multicolour server routing", async() => {
  const server = new MulticolourServer({
    type: "api",
  })

  for await (const testableRoute of testableRoutes) {
    server.route(testableRoute.route)
    const response = new ServerResponse()
    const request = new IncomingMessage({
      url: testableRoute.route.path,
      method: testableRoute.route.method.toUpperCase(),
      headers: testableRoute.headers,
    })

    const reply = await server.onRequest(request, response)
  
    await testableRoute.expected(reply, response)
  }
  
  const response = new ServerResponse()
  server.onRequest(new IncomingMessage({
    url: "/nope",
    method: "GET",
  }), response)
    .then(() => {
      expect(response.statusCode).toBe(404)
      expect(response.statusCode).not.toBe(500)
    })
})

test("Server content negotiator", () => {
  const server = new MulticolourServer({
    type: "api",
  })
  const JsonNegotiator = require("../lib/server/request-parsers/parsers/json")
  const classNegotiator = class {
    static get negotiationAccept() { return "text/html" }
    async parseBody() {}
  }

  server.addContentNegotiator(JsonNegotiator)
  server.addContentNegotiator(classNegotiator)

  expect(server.negotiators["application/json"]).toBeTruthy()
})
