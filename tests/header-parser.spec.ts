const {
  HeaderParser,
  parseAcceptHeader,
  parseContentTypeHeader,
} = require("../lib/server/request-parsers/header-parser")
const { ClientRequest } = require("./mocks/http")
const { HttpError } = require("../lib/better-errors/http-error")

const goodAcceptHeaders = [
  {
    contentType: "text/plain",
    expected: {
      contentType: "text/plain",
      quality: 1,
    },
  },
  {
    contentType: "application/vnd.api+json",
    expected: {
      contentType: "application/vnd.api+json",
      quality: 1,
    },
  },
  {
    contentType: "*/*",
    expected: {
      contentType: "*/*",
      quality: 1,
    },
  },
  {
    contentType: "application/json;q=0.1",
    expected: {
      contentType: "application/json",
      quality: 0.1,
    },
  },
  {
    contentType: "text/plain;q=0.5,text/html;q=0.001,application/json",
    expected: [
      {
        contentType: "application/json",
        quality: 1,
      },
      {
        contentType: "text/plain",
        quality: 0.5,
      },
      {
        contentType: "text/html",
        quality: 0.001,
      },
    ],
  },
]

const goodContentTypeHeaders = [
  {
    contentType: "application/json",
    expected: {
      contentType: "application/json",
    },
  },
  {
    contentType: "application/json",
    expected: {
      contentType: "application/json",
    },
  },
  {
    contentType: "multipart/form-data; boundary=---12345multicolour",
    expected: {
      contentType: "multipart/form-data",
      boundary: "---12345multicolour",
    },
  },
  {
    contentType: "application/json; charset=utf-8",
    expected: {
      contentType: "application/json",
      charset: "utf-8",
    },
  },
  {
    contentType: "multipart/form-data; boundary=---12345multicolour; charset=utf-8",
    expected: {
      contentType: "multipart/form-data",
      boundary: "---12345multicolour",
      charset: "utf-8",
    },
  },
]

test("Header parser: Accept headers", () => {
  goodAcceptHeaders.forEach(header => {
    const parsedHeaders = parseAcceptHeader(header.contentType)

    expect(parsedHeaders).toEqual(header.expected)
  })
})

test("Header parser: Content Type headers", () => {
  goodContentTypeHeaders.forEach(header => {
    const parsedHeaders = parseContentTypeHeader(header.contentType)

    expect(parsedHeaders).toEqual(header.expected)
  })

})

test("Bad content type headers", () => {
  const badDirectiveContentType = () => 
    parseContentTypeHeader("application/json; --boundary=" + "1".repeat(256))

  expect(badDirectiveContentType).toThrow(HttpError)

  const badDirectiveContentTypeKey = () =>
    parseContentTypeHeader("application/json; " + "a".repeat(101) + "=1")
  
  expect(badDirectiveContentTypeKey).toThrow(HttpError)
})

test("Header parser: HeaderParser", () => {
  const parsedHeaders = HeaderParser(new ClientRequest({
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
  }))

  expect(parsedHeaders).toEqual({
    accept: {
      contentType: "application/json",
      quality: 1,
    },
    "content-type": {
      contentType: "application/json",
    },
  })
})

test("Bad Header parser", () => {
  const badHeaderParserCall = () => HeaderParser()
  expect(badHeaderParserCall).toThrow(HttpError)

  expect(HeaderParser(new ClientRequest({}))).toEqual({})
})

