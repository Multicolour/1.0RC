const JsonParser = require("../lib/server/body-parser/parsers/json")

const badPayloads = [ 
  require("./content/payloads/bad/json/bad-entry-char"),
  require("./content/payloads/bad/json/syntax-error"),
]

test("JSON body parser", () => {
  Promise.all(badPayloads.map(payload => JsonParser(payload).catch(({ statusCode }) => statusCode)))
    .then(results => expect(results.every(code => code === 400)).toBe(true))
})

