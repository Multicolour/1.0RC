const {
  ClientRequest,
  ServerResponse, 
} = require("./mocks/http")

const MulticolourServer = require("../lib/server/server")

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
