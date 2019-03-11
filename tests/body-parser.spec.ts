import bodyParser from "../lib/server/request-parsers/body-parser"
import { IncomingRequest } from "./mocks/http"

{
  test("Body parser", () => {
    const request = new IncomingRequest({
      url: "/body-parser",
      method: "POST",
    })

    const parser = bodyParser({ request })

    request.emit("data", Buffer.from("1234", "utf-8"))
    request.emit("end")

    parser
      .then(value => expect(value).toEqual("1234"))
  })

  test("Body parser max size", () => {
    const request = new IncomingRequest({
      url: "/body-parser",
      method: "POST",
    })

    const parser = bodyParser({ request, maxBodySize: 1 })

    request.emit("data", Buffer.from("1234", "utf-8"))
    request.emit("end")

    parser
      .catch((error: Error) => expect(error.messageAST.message).toEqual("Body size exceeded the maximum body size allowed on this server. Please try again with a smaller payload.")) //eslint-disable-line max-len
  })
}
