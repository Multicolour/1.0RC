const { ClientRequest } = require("./mocks/http")

const JsonParser = require("../lib/server/request-parsers/parsers/json")

const badPayloads = [ 
  require("./content/payloads/bad/json/bad-entry-char"),
  require("./content/payloads/bad/json/syntax-error"),
]

const goodPayloads = [
  require("./content/payloads/good/json/array"),
  require("./content/payloads/good/json/object"),
]

test("JSON body parser with known bad payloads", async() => {
  const parsers = badPayloads.map(payload => {
    const request = new ClientRequest()
    const parser = JsonParser(request)
    
    request.emit("data", payload)
    request.emit("end")

    return parser
      .catch(({ statusCode }) => statusCode)
  })

  const statusCodes = await Promise.all(parsers)
 
  expect(statusCodes.every(code => code === 400)).toBe(true)
})

test("JSON body parser with known good payloads", async() => {
  const parsers = goodPayloads.map(payload => {
    const request = new ClientRequest()
    const parser = JsonParser(request)

    request.emit("data", payload)
    request.emit("end")

    return parser
  })

  const payloads = await Promise.all(parsers)

  expect(payloads[0]).toEqual(JSON.parse(goodPayloads[0]))
  expect(payloads[1]).toEqual(JSON.parse(goodPayloads[1]))
})

