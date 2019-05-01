import http from "http"
import BoyerMooreHorspool from "./lib/content-negotiators/multipart/boyer-moore"

let boundary = "--X-INSOMNIA-BOUNDARY"
let indexes: number[] = []
const algo = new BoyerMooreHorspool(boundary)

function parseBufferData(data: Buffer): number[] {

  indexes = indexes.concat(algo.search(data))

  return indexes
}

http
  .createServer((request, response) => {
    const bodyParts: number[][] = []
    const ct = request.headers["content-type"] || ""
    boundary = "--" + ct.split(";")[1].split("=")[1]
    request.on("data", (chunk: Buffer) => bodyParts.push(parseBufferData(chunk)))
    request.on("end", () => {
      algo.getBodyFieldStrings(body, indices)
      response.end(JSON.stringify(bodyParts, null, 2))
    })
  })
  .listen(5000, () => console.log("listening on 5000"))
