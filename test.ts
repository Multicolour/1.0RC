import http from "http"
import { boyerMooreSearch } from "./lib/content-negotiators/multipart/boyer-moore"

let boundary = "--X-INSOMNIA-BOUNDARY"

function parseBufferData(data: Buffer): number[] {
  let size = data.length
  let buffer = data
  const indexes: number[] = []
  let i = 0

  console.log(data.toString())
  console.log("\n".repeat(3))

  // As long as there's content to check, loop.
  while (size > 0 && i < 5) {
    const result = boyerMooreSearch(buffer, boundary)
    if (result !== -1) {
      // Create a new buffer without this match for the next loop.
      const tempBuffer = Buffer.allocUnsafe(buffer.length - result)
      buffer.copy(
        tempBuffer,
        0,
        0,
        result,
      )

      // Add this result to our collector.
      indexes.push(result)
      console.log(i)
      console.log(tempBuffer.toString(), "\n".repeat(3))
      // console.log(result, ":", buffer.toString().substr(result, result + boundary.length))

      // update the size buffer.
      size = tempBuffer.length
      buffer = tempBuffer
    }
    else {
      // No match inthe entire string. exit loop.
      size = 0
    }
    i++
  }

  return indexes
}

http
  .createServer((request, response) => {
    const bodyParts: number[][] = []
    const ct = request.headers["content-type"] || ""
    boundary = ct.split(";")[1].split("=")[1]
    request.on("data", (chunk: Buffer) => bodyParts.push(parseBufferData(chunk)))
    request.on("end", () => {

      response.end(JSON.stringify(bodyParts, null, 2))
    })
  })
  .listen(5000, () => console.log("listening on 5000"))
