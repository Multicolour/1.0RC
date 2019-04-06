import { IncomingMessage } from "./mocks/http"

import JsonParser from "@lib/content-negotiators/json"
import badEntryChar from "./content/payloads/bad/json/bad-entry-char"
import syntaxError from "./content/payloads/bad/json/syntax-error"

import jsonArray from "./content/payloads/good/json/array"
import jsonObject from "./content/payloads/good/json/object"

const badPayloads = [
  badEntryChar,
  syntaxError,
]

const goodPayloads = [
  jsonArray,
  jsonObject,
]

test("JSON body parser with known bad payloads", async () => {
  const parsers = badPayloads.map((payload) => {
    const request = new IncomingMessage({
      url: "test",
    })
    const jsonParser = new JsonParser()
    const parser = jsonParser.parseBody({ request })

    request.emit("data", payload)
    request.emit("end")

    return parser
      .catch(({statusCode}) => statusCode) // Kill the error, we want to test it.
  })

  const statusCodes = await Promise.all(parsers)
  expect(statusCodes.every((code) => code === 400)).toBe(true)
})

test("JSON body parser with known good payloads", async () => {
  const parsers = goodPayloads.map((payload) => {
    const request = new IncomingMessage({
      url: "/test",
    })
    const jsonParser = new JsonParser()
    const parser = jsonParser.parseBody({ request })

    request.emit("data", payload)
    request.emit("end")

    return parser
  })

  const payloads = await Promise.all(parsers)

  expect(payloads[0]).toEqual(JSON.parse(goodPayloads[0]))
  expect(payloads[1]).toEqual(JSON.parse(goodPayloads[1]))
})

