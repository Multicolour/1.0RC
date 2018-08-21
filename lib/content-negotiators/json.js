// @flow

import type { ClientRequest } from "http"

const Promise = require("bluebird")

module.exports = {
  body<T>(request: ClientRequest): Promise<T> {
    const body = []
    return new Promise((resolve, reject) => {
      request
        .on("data", (chunk: Buffer) => {
          body.push(chunk)

          if (body.length > 2e+6)
            reject({
              code: 413,
            })
        })
        .on("end", () => {
          try {
            const parsedBody = JSON.parse(Buffer.concat(body).toString())
            resolve(parsedBody)
          }
          catch (error) {
            reject({
              code: 400,
              error
            })
          }
        })
    })
  }
}
