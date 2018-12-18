const bodyParser = require("../lib/server/body-parser/body-parser")

const { ClientRequest } = require("./mocks/http")

test("Body parser", () => {
  const request = new ClientRequest({
    url: "/body-parser",
    method: "POST",
  })

  const parser = bodyParser(request)

  request.emit("data", Buffer.from("1234", "utf-8"))
  request.emit("end")

  parser
    .then(value => expect(value).toEqual("1234"))
})

test("Body parser max size", () => {
  const request = new ClientRequest({
    url: "/body-parser",
    method: "POST",
  })

  const parser = bodyParser(request, 1)

  request.emit("data", Buffer.from("1234", "utf-8"))
  request.emit("end")

  parser
    .catch(error => expect(error.messageAST.message).toEqual("Body size exceeded the maximum body size allowed on this server. Please try again with a smaller payload."))
})
