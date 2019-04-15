import http from "http"
import { boyerMooreSearch } from "./lib/content-negotiators/multipart/boyer-moore"

let boundary = "--X-INSOMNIA-BOUNDARY"

function parseBufferData(data: Buffer): number[] {
  let buffer = data
  let lastResult = 0
  const indexes: number[] = []

  // As long as there's matches, keep searching.
  while (lastResult !== -1) {
    const result = boyerMooreSearch(buffer, boundary)
    const newBufferSize = buffer.length - (result + boundary.length)
    console.log(buffer.length, result)
    console.log("\n".repeat(3))
    // console.log("nb:", result, buffer.toString(), newBufferSize, "\n".repeat(2))

    if (newBufferSize < 0) {
      break
    }

    // Create a new buffer without this match for the next loop.
    const tempBuffer = Buffer.allocUnsafe(newBufferSize)

    buffer.copy(
      tempBuffer,
      0,
      0,
      newBufferSize,
    )

    // Add this result to our collector.
    indexes.push(result)

    // update the buffer.
    buffer = tempBuffer
    lastResult = result
  }

  return indexes
}

http
  .createServer((request, response) => {
    const bodyParts: number[][] = []
    const ct = request.headers["content-type"] || ""
    boundary = ct.split(";")[1].split("=")[1]
    console.log("boundary is:\n%s\n", boundary)
    request.on("data", (chunk: Buffer) => bodyParts.push(parseBufferData(chunk)))
    request.on("end", () => {

      response.end(JSON.stringify(bodyParts, null, 2))
    })
  })
  .listen(5000, () => console.log("listening on 5000"))
