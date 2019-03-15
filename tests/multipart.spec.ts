import { IncomingMessage } from "./mocks/http"
import MultipartNegotiator from "@lib/server/request-parsers/parsers/multipart"

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


test("Multipart negotiator", () => {
  expect.assertions(1)
  const request = new IncomingMessage({
    url: "/test",
    headers: {
      "content-type": "multipart/form-data; boundary=boundery",
      "content-length": payload.length,
    },
  })
  const parser = MultipartNegotiator({ request })

  request.emit("data", Buffer.from(payload, "utf-8"))
  request.emit("end")

  return expect(parser).resolves.toEqual({
    field1: "value1",
    field2: {
      filename: "example.txt",
      contents: "value2",
    },
  })
})
