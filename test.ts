import http from "http"
import { boyerMooreSearch } from "./lib/content-negotiators/multipart/boyer-moore"

const boundary = "--X-INSOMNIA-BOUNDARY"

function parseBufferData(data: Buffer): number[] {
  let size = data.length
  let buffer = data
  const indexes: number[] = []

  while (size > 0) {
    const result = boyerMooreSearch(data, boundary)

    if (result !== -1) {
      const tempBuffer = Buffer.allocUnsafe(buffer.length - (result + boundary.length))
      indexes.push(result)
      buffer.copy(
        tempBuffer,
        0,
        result,
        buffer.length,
      )

      size = tempBuffer.length
      buffer = tempBuffer
    }
  }

  return indexes
}

http
  .createServer((request, response) => {

    request.on("data", parseBufferData)
    request.on("end", () =>
      response.end(),
    )
  })
  .listen(5000)
