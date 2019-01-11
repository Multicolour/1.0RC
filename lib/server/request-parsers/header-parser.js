// @flow

const HttpError = require("../../better-errors/http-error")

import type { IncomingMessage } from "http"
import type { Multicolour$ReplyContext } from "@flow/reply.flow"

export type AcceptHeaderValue = {
  contentType: string,
  quality: number,
}

export type AcceptHeader = AcceptHeaderValue | AcceptHeaderValue[]

export type ContentTypeHeader = {
  contentType: string,
  boundary?: string,
  charset?: string,
}

function parseContentTypeHeader(header: string = ""): ContentTypeHeader {
  const [contentType, ...directives] = header.split(";")

  const returnHeader = {
    contentType,
  }

  return directives
    .filter(Boolean)
    .map((directive: string = "") => directive.trim())
    .reduce((out: ContentTypeHeader, currentDirectiveKV) => {
      const [key, value] = currentDirectiveKV.split("=")

      if (key.length > 100)
        throw new HttpError({
          statusCode: 400,
          error: {
            message: `The key "${JSON.stringify(key)}" exceeds 100 characters in length.`,
          },
        })

      if (value.length > 255)
        throw new HttpError({
          statusCode: 400,
          error: {
            message: `The value for the "${key}" directive in the content-type header exceeds 255 characters.`,
          },
        })

      // We want to ignore unknown directives to prevent as many arbitrary memory attacks by fillong them up.
      switch (key) {
      case "boundary":
        out.boundary = value
        break
      case "charset":
        out.charset = value
        break
      }
      return out
    }, returnHeader)
}

function parseAcceptHeader(header: string = ""): AcceptHeader {
  const parts = header.split(",")

  const values = parts
    .filter(Boolean)
    .map((value: string) => {
      const [contentType, qualityUnparsed] = value.split(";")

      let quality = 1

      if (qualityUnparsed)
        quality = Number(qualityUnparsed.split("=")[1])

      return {
        contentType,
        quality,
      }
    })

  return values.length === 1
    ? values[0]
    : values.sort((left: AcceptHeaderValue, right: AcceptHeaderValue) => 
      right.quality - left.quality
    )
}

function HeaderParser(request: IncomingMessage, context: Multicolour$ReplyContext = {}) {
  if (!request) 
    throw new HttpError({
      statusCode: 500,
      error: {
        message: "The request handler tried to parse the request headers but failed to pass the request. This is a developer problem. Please contact the owner of this API.", // eslint-disable-line max-len
      },
    })

  if (!request.headers)
    return {}

  const accept = parseAcceptHeader(request.headers.accept)
  const contentType = parseContentTypeHeader(request.headers["content-type"])

  context.contentType = contentType

  return {
    ...request.headers,
    accept,
    "content-type": contentType,
  }
}

module.exports = {
  HeaderParser,
  parseAcceptHeader,
  parseContentTypeHeader,
}
