import http from "http"
import boyerMoore from "./lib/content-negotiators/multipart/boyer-moore"

http
  .createServer((request, response) => {
    const boundaryIndexes: number[] = []
    const boundary = "--X-INSOMNIA-BOUNDARY--"

    request.on("data", (data: Buffer) => {
      const index = boyerMoore.indexOf(data, Buffer.from(boundary))
      console.log(index)
      if (index > -1) {
        boundaryIndexes.push(index)
      }
    })
    request.on("end", () => {
      console.log(boundaryIndexes)
    })
    response.end("123")
  })
  .listen(5000)
