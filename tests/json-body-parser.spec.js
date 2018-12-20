const { ClientRequest } = require("./mocks/http")

const JsonParser = require("../lib/server/body-parser/parsers/json")

const badPayloads = [ 
  require("./content/payloads/bad/json/bad-entry-char"),
  require("./content/payloads/bad/json/syntax-error"),
]

const goodPayloads = [
  require("./content/payloads/good/json/array"),
  require("./content/payloads/good/json/object"),
]

test("JSON body parser with known bad payloads", () => {
  expect.assertions(badPayloads.length)
  badPayloads.forEach(payload => {
    const request = new ClientRequest()

    const parser = JsonParser(request)

    request.emit("data", payload)
    request.emit("end")

    expect(parser).rejects.toEqual(expect.objectContaining({ statusCode: 400 }))
  })
})

