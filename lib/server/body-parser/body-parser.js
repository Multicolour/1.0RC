// @flow

import type { ClientRequest } from "http"
import type { Resolve, Reject } from "bluebird"

const HttpError = require("../../better-errors/http-error")
const Promise = require("bluebird")

async function BodyParser(request: ClientRequest, maxBodySize: number = 2e7): Promise<Object> {
  return new Promise((resolve: Resolve, reject: Reject) => {
    const body: Buffer[] = []
    let bodySize = 0
    request.on("data", (data: Buffer) => {
      const dataSize = Buffer.byteLength(data)

      if (bodySize + dataSize > maxBodySize)
        return reject(new HttpError({
          statusCode: 400,
          error: {
            message: "Body size exceeded the maximum body size allowed on this server. Please try again with a smaller payload.", // eslint-disable-line max-len
          },
        }))

      bodySize += dataSize
      body.push(data)
    })

    request.on("end", () => resolve(escape(body.toString())))
  })
}

module.exports = BodyParser

