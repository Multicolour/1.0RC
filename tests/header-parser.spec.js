const {
  HeaderParser,
  parseAcceptHeader,
} = require("../lib/server/request-parsers/header-parser")
const { ClientRequest } = require("./mocks/http")

const goodAcceptHeaders = [
  {
    contentType: "text/plain",
    expected: {
      contentType: "text/plain",
    },
  },
  {
    contentType: "application/vnd.api+json",
    expected: {
      contentType: "application/vnd.api+json",
    },
  },
  {
    contentType: "*/*",
    expected: {
      contentType: "*/*",
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
    contentType: "text/plain;q=0.5,text/html;q=0.001",
    expected: {
      contentTypes: [
        {
          contentType: "text/html",
          quality: 0.5,
        },
        {
          contentType: "text/html",
          quality: 0.001,
        },
      ],
    },
  },
]

test("Header parser: Accept headers", () => {
  goodAcceptHeaders.forEach(header => {
    const parsedHeaders = parseAcceptHeader(header.contentType)

    expect(parsedHeaders).toEqual(header.expected)
  })
})

