import http from "http"
import { boyerMooreSearch } from "./lib/content-negotiators/multipart/boyer-moore"

let boundary = "--X-INSOMNIA-BOUNDARY"

function parseBufferData(data: Buffer): number[] {
  let size = data.length
  let buffer = data
  const indexes: number[] = []

  while (size > 0) {
    const result = boyerMooreSearch(buffer, boundary)
    console.log("R", result, size)
    console.log(buffer.toString())

    if (result !== -1) {
      const tempBuffer = Buffer.allocUnsafe(buffer.length - (result + boundary.length))
      indexes.push(size - result)
      buffer.copy(
        tempBuffer,
        0,
        result,
        buffer.length,
      )

      size = tempBuffer.length
      buffer = tempBuffer
    }
    else {
      size = 0
    }
  }

  return indexes
}

http
  .createServer((request, response) => {
    const bodyParts: number[][] = []
    const ct = request.headers["content-type"] || ""
    boundary = ct.split(";")[1].split("=")[1]
    request.on("data", (chunk: Buffer) => bodyParts.push(parseBufferData(chunk)))
    request.on("end", () =>
      response.end(JSON.stringify(bodyParts, null, 2)),
    )
  })
  .listen(5000)
