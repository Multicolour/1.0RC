import { readFileSync } from "fs"
import http from "http"
import BoyerMooreHorspool from "./lib/content-negotiators/multipart/boyer-moore"

http
  .createServer((request, response) => {
    const start = Date.now()
    if ((request.method || "").toLowerCase() === "get") {
      return response.end(readFileSync("./dev-form.html"))
    }

    const ct = request.headers["content-type"] || ""
    const boundary = "--" + ct.split(";")[1].split("=")[1]
    const body: Buffer[] = []
    const algo = new BoyerMooreHorspool(boundary)
    let indexes: number[] = []

    function parseBufferData(data: Buffer): void {
      body.push(data)
      indexes = indexes.concat(algo.search(data))
    }

    request.on("data", parseBufferData)

    request.on("end", () => {
      const buf = Buffer.concat(body)
      const rawFields = algo.getBodyFieldStrings(buf, indexes)
      const parsedBodyParts = algo.parseBodyFields(rawFields)
      setImmediate(() => response.end(JSON.stringify(parsedBodyParts, null, 2)))
      console.log("Response took: %dms", Date.now() - start)
    })
  })
  .listen(5000, () => console.log("listening on 5000"))
