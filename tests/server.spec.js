const {
  ClientRequest,
  ServerResponse, 
} = require("./mocks/http")

const MulticolourServer = require("../lib/server/server")
const HttpError = require("../lib/better-errors/http-error")

test("Multicolour server instantiation", () => {
  expect(new MulticolourServer()).toBeTruthy()
  expect(new MulticolourServer({
    serverOptions: {},
    secure: true,
  })).toBeTruthy()
})

test("Multicolour server routing", () => {
  const server = new MulticolourServer()
  const response = new ServerResponse()
  const mock = jest.fn()

  server
    .route({
      method: "get",
      path: "/test",
      handler: async() => mock(),
    })
    .route({
      method: "get",
      path: "/text",
      handler: async() => "Text",
    })
    .route({
      method: "get",
      path: "/json",
      handler: async() => ({ json: true }),
    })
    .route({
      method: "get",
      path: "/not-a-function",
      handler: 123,
    })
    .route({
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
    })

  expect(typeof new HttpError({
    statusCode: 400,
    error: {
      message: "Test",
    },
  }).prettify()).toEqual("string")

  server.onRequest(new ClientRequest({
    url: "/throws-http-error",
    method: "GET",
  }), response)
    .catch(error => 
      expect(error).toEqual(expect.objectContaining({
        statusCode: 418,
      })))
  
  server.onRequest(new ClientRequest({
    url: "/not-a-function",
    method: "GET",
  }), response)

  expect(response.statusCode).toEqual(500)

  server.onRequest(new ClientRequest({
    url: "/test",
    method: "GET",
  }), response)

  expect(response.statusCode).not.toBe(404)
  expect(mock).toHaveBeenCalled()

  server.onRequest(new ClientRequest({
    url: "/text",
    method: "GET",
  }), response)

  expect(response.statusCode).not.toBe(404)
  expect(mock).toHaveBeenCalled()

  server.onRequest(new ClientRequest({
    url: "/json",
    method: "GET",
  }), response)

  expect(response.statusCode).not.toBe(404)
  expect(mock).toHaveBeenCalled()

  server.onRequest(new ClientRequest({
    url: "/nope",
    method: "GET",
  }), response)

  expect(response.statusCode).toBe(404)
})

test("Server content negotiator", () => {
  const server = new MulticolourServer()
  const JsonNegotiator = require("../lib/server/body-parser/parsers/json")
  const classNegotiator = class {
    static get negotiationAccept() { return "text/html" }
    async parseBody() {}
  }

  server.addContentNegotiator(JsonNegotiator)
  server.addContentNegotiator(classNegotiator)

  expect(server.negotiators["application/json"]).toBeTruthy()
})
