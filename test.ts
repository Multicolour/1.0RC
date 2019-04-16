import http from "http"
import { boyerMooreSearch } from "./lib/content-negotiators/multipart/boyer-moore"

let boundary = "--X-INSOMNIA-BOUNDARY"

function parseBufferData(data: Buffer): number[] {
  let buffer = data
  let lastResult: number | null = null
  const indexes: number[] = []

  // As long as there's matches, keep searching.
  while (lastResult !== -1) {
    // Add the last result to our collector.
    if (lastResult !== null) {
      indexes.push(lastResult)
    }

    // Do another search.
    const result = boyerMooreSearch(buffer, boundary)

    // Get the next offset.
    const resultOffsetNum = result + boundary.length + 2

    // Calculate how big the next buffer needs to be
    const newBufferSize = buffer.length - resultOffsetNum

    console.log("r", result,  "bl", boundary.length, "bs", buffer.length, "nbs", newBufferSize, "ro", resultOffsetNum)
    console.log("nb:\n")
    console.log(JSON.stringify(buffer.toString()), "\n".repeat(2))

    // Check the new buffer will have a positive size.
    // Exit if it doesn't, there's nowt left to search.
    if (newBufferSize < 0) {
      break
    }

    // Create a new buffer without this match for the next loop.
    const tempBuffer = Buffer.alloc(newBufferSize)

    // Copy the contents of the current buffer into a new one
    // using the calculated result offset to shrink it.
    buffer.copy(
      tempBuffer,
      0,
      resultOffsetNum,
      newBufferSize,
    )

    console.log("NEW BUFFER", tempBuffer.length)
    console.log(tempBuffer.toString())
    console.log("\n".repeat(3))


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
    boundary = "--" + ct.split(";")[1].split("=")[1]
    console.log("boundary is:\n%s\n", JSON.stringify(boundary))
    request.on("data", (chunk: Buffer) => bodyParts.push(parseBufferData(chunk)))
    request.on("end", () => {

      response.end(JSON.stringify(bodyParts, null, 2))
    })
  })
  .listen(5000, () => console.log("listening on 5000"))
