import http from "http"
import { boyerMooreSearch } from "./lib/content-negotiators/multipart/boyer-moore"

http
  .createServer((request, response) => {
    const boundary = "--X-INSOMNIA-BOUNDARY"
    let indexes: number[] = []

    request.on("data", (data: Buffer) => {
      let size = data.length
      let buffer = data
      
      while (size > 0) {
        const result = boyerMooreSearch(data, boundary)

        if (result !== -1) {
          indexes.push(result)
          buffer = Buffer.copy(Buffer.allocUnsafe(buffer.length - (result + boundary.length)), 0, result, buffer.length))
          
        }

        
      }
      
      if (results.size) {
        indexes = [
          ...indexes,
          ...results,
        ]
      }
    })
    request.on("end", () =>
      response.end(JSON.stringify(indexes, null, 2)),
    )
  })
  .listen(5000)
