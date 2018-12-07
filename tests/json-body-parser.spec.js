
const Promise = require("bluebird")

const JsonParser = require("../lib/server/body-parser/parsers/json")

const badPayloads = [ 
  require("./content/payloads/bad/json/bad-entry-char"),
  require("./content/payloads/bad/json/syntax-error"),
]

const goodPayloads = [
  require("./content/payloads/good/json/array"),
  require("./content/payloads/good/json/object"),
]

test("JSON body parser", () => {
  Promise.all(badPayloads.map(payload => JsonParser(payload).catch(({ statusCode }) => statusCode)))
    .then(results => expect(results.every(code => code === 400)).toBe(true))
  
  Promise.all(goodPayloads.map(payload => JsonParser(payload).catch(({ statusCode }) => statusCode)))
    .then(results => expect(results.every(code => code === 200)).toBe(true))
})

