const JsonParser = require("../lib/server/body-parser/parsers/json")

const badEntryCharBody = require("./content/payloads/bad/json/bad-entry-char")
const containsFunctionBody = require("./content/payloads/bad/json/contains-function")
const tooLargeBody = require("./content/payloads/bad/json/too-large")

test("JSON body parser", () => {
  JsonParser(badEntryCharBody)
    .catch(error => {
      expect(error.statusCode).toBe(400)
    })
  
  JsonParser(containsFunctionBody)
    .catch(error => {
      expect(error.statusCode).toBe(400)
    })

  JsonParser(tooLargeBody)
    .catch(error => {
      expect(error.statusCode).toBe(400)
    })
})

