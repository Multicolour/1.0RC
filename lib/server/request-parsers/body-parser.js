// @flow

import type { IncomingMessage } from "http"
import type { Resolve, Reject } from "bluebird"

export type BodyParserArgs = {
  request: IncomingMessage, 
  maxBodySize?: number,
}

const HttpError = require("../../better-errors/http-error")
const Promise = require("bluebird")

async function BodyParser(config: BodyParserArgs): Promise<Object> {
  if (!config.request)
    return Promise.reject(new HttpError({
      statusCode: 500,
      error: {
        message: "The body parser was invoked without a request in which to parse. This is a developer problem, please contact the owner of this API to resolve this issue.", // eslint-disable-line max-len
      },
    }))

  return new Promise((resolve: Resolve, reject: Reject) => {
    const body: Buffer[] = []
    const maxBodySize = config.hasOwnProperty("maxBodySize")
      ? config.maxBodySize
      : 2e7 // Max 20mb upload limit.

    let bodySize = 0

    config.request.on("data", (data: Buffer) => {
      const dataSize = Buffer.byteLength(data)

      if (maxBodySize && bodySize + dataSize > maxBodySize)
        return reject(new HttpError({
          statusCode: 400,
          error: {
            message: "Body size exceeded the maximum body size allowed on this server. Please try again with a smaller payload.", // eslint-disable-line max-len
          },
        }))

      bodySize += dataSize
      body.push(data)
    })

    config.request.on("end", () => resolve(body.toString()))
  })
}

module.exports = BodyParser

