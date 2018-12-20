const testPayload = `
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

const MultipartNegotiator = require("../lib/server/body-parser/parsers/multipart")

test("Multipart negotiator", () => {
  
})
