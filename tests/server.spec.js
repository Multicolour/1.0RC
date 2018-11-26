const {
  ClientRequest, 
  ServerResponse,
} = require("http")

const MulticolourServer = require("../lib/server/server")

test("Multicolour server instantiation", () => {
  expect(new MulticolourServer()).toBeTruthy()
  expect(new MulticolourServer({
    serverOptions: {},
    secure: true,
  })).toBeTruthy()
})

test("Multicolour server headers", () => {
  const server = new MulticolourServer()
  const response = new ServerResponse({})

  server.writeHeaders(response, {
    "X-Test-Header": 123,
  })

  expect(response.hasHeader("x-test-header")).toBe(true)
  expect(response.getHeader("x-test-header")).toBe(123)
})

test("Multicolour server routing", () => {
  const server = new MulticolourServer()
  const request = new ClientRequest({})
  const response = new ServerResponse({
    req: request,
  })

  server.route({
    method: "get",
    path: "/test",
    handle: async() => {},
  })

  request.url = "/test"
  request.method = "GET"
  server.onRequest(request, response)

  console.log(response)
})
