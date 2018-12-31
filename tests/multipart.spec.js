const payload = `
POST /test.html HTTP/1.1
Host: example.org
Content-Type: multipart/form-data;boundary="boundary"

--boundary
Content-Disposition: form-data; name="field1"

value1
--boundary
Content-Disposition: form-data; name="field2"; filename="example.txt"

value2
--boundary--
`
const { ClientRequest } = require("./mocks/http")

const MultipartNegotiator = require("../lib/server/body-parser/parsers/multipart")

test("Multipart negotiator", () => {
  const request = new ClientRequest({
    headers: {
      "content-type": "multipart/form-data; boundary=boundery",
      "content-length": payload.length,
    },
  })
  const parser = MultipartNegotiator(request)

  request.emit("data", Buffer.from(payload, "utf-8"))

  // Don't close the request too fast. Formidable needs to parse the form body.
  setTimeout(() => request.emit("end"), 500)

  parser
    .then(console.log.bind(console, "success"))
    .catch(console.error.bind(console, "fail"))
  expect.assertions(1)
})
