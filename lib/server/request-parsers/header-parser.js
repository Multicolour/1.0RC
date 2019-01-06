// @flow

const HttpError = require("../../better-errors/http-error")

import type { ClientRequest } from "http"

export type AcceptHeaderValue = {
  contentType: string,
  quality: number,
}

export type AcceptHeader = AcceptHeaderValue[]

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
    .reduce((out: ContentTypeHeader, currentDirectiveKV) => {
      const [key, value] = currentDirectiveKV.split("=")
      // We want to ignore unknown directives to prevent as many arbitrary memory attacks.
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

  return parts
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
}

function HeaderParser(request: ClientRequest) {
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
