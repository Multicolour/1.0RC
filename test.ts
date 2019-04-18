import http from "http"
import BoyerMooreHorspool from "./lib/content-negotiators/multipart/boyer-moore"

let boundary = "--X-INSOMNIA-BOUNDARY"

function parseBufferData(data: Buffer): number[] {
  let lastResult: number | void
  const indexes: number[] = []
  const algo = new BoyerMooreHorspool(boundary)

  // As long as there's matches, keep searching.
  while (lastResult !== -1) {
    let result = -1
    // Add the last result to our collector.
    if (typeof lastResult !== "undefined") {
      indexes.push(lastResult)
      result = algo.search(data, lastResult + boundary.length + 2)
      console.log(result, data.toString().substr(lastResult + boundary.length + 2, data.length))
    }
    else {
      result = algo.search(data)
    }

    console.log(result)
    lastResult = result
  }

  return indexes
}

http
  .createServer((request, response) => {
    const bodyParts: number[][] = []
    const ct = request.headers["content-type"] || ""
    boundary = "--" + ct.split(";")[1].split("=")[1]
    console.log("boundary is:\n%s\n", JSON.stringify(boundary))
    request.on("data", (chunk: Buffer) => bodyParts.push(parseBufferData(chunk)))
    request.on("end", () => {

      response.end(JSON.stringify(bodyParts, null, 2))
    })
  })
  .listen(5000, () => console.log("listening on 5000"))
