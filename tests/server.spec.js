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
  const request = new ClientRequest({
    url: "/test",
    method: "GET",
  })
  const response = new ServerResponse()

  server.route({
    method: "get",
    path: "/test",
    handler: async() => {},
  })

  server.onRequest(request, response)

  expect(response.statusCode).not.toBe(404)
})
