import http from "http"
import { boyerMooreSearch } from "./lib/content-negotiators/multipart/boyer-moore"

http
  .createServer((request, response) => {
    const boundary = "--X-INSOMNIA-BOUNDARY"
    let indexes: number[] = []

    request.on("data", (data: Buffer) => {
      const results = boyerMooreSearch(data, boundary)
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
