import http from "http"
import BoyerMooreHorspool from "./lib/content-negotiators/multipart/boyer-moore"

let boundary = "--X-INSOMNIA-BOUNDARY"
let indexes: number[] = []
const body: Buffer[] = []
let algo: BoyerMooreHorspool

function parseBufferData(data: Buffer): void {
  body.push(data)
  indexes = indexes.concat(algo.search(data))
}

http
  .createServer((request, response) => {
    const ct = request.headers["content-type"] || ""
    boundary = "--" + ct.split(";")[1].split("=")[1]
    algo = new BoyerMooreHorspool(boundary)
    request.on("data", parseBufferData)

    request.on("end", () => {
      const buf = Buffer.concat(body)
      console.log(algo.getBodyFieldStrings(buf, indexes))
      response.end(JSON.stringify(indexes, null, 2))
    })
  })
  .listen(5000, () => console.log("listening on 5000"))
