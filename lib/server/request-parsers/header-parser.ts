import {
  MulticolourAcceptHeader,
  MulticolourAcceptHeaderValue,
  MulticolourContentTypeHeader,
  MulticolourReplyContext,
} from "@mc-types/multicolour/reply"
import { IncomingMessage } from "http"
import { MulticolourParsedHeaders } from "../incoming-message"

import MulticolourHttpError from "@lib/better-errors/http-error"

function parseContentTypeHeader(header = ""): MulticolourContentTypeHeader {
  const [contentType, ...directives] = header.split(";")

  const returnHeader: MulticolourContentTypeHeader = {
    contentType,
  }

  return directives
    .filter(Boolean)
    .map((directive = "") => directive.trim())
    .reduce(
      (
        out: MulticolourContentTypeHeader,
        currentDirectiveKV,
      ): MulticolourContentTypeHeader => {
        const [key, value] = currentDirectiveKV.split("=")

        if (key.length > 100) {
          throw new MulticolourHttpError({
            statusCode: 400,
            error: {
              message: `The key "${JSON.stringify(
                key,
              )}" exceeds 100 characters in length.`,
            },
          })
        }

        if (value.length > 255) {
          throw new MulticolourHttpError({
            statusCode: 400,
            error: {
              message: `The value for the "${key}" directive in the content-type header exceeds 255 characters.`,
            },
          })
        }

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
      },
      returnHeader,
    )
}

function parseAcceptHeader(header = ""): MulticolourAcceptHeader {
  const parts = header.split(",")

  const values = parts.filter(Boolean).map((value: string) => {
    const [contentType, qualityUnparsed] = value.split(";")

    let quality = 1

    if (qualityUnparsed) {
      quality = Number(qualityUnparsed.split("=")[1])
    }

    return {
      contentType,
      quality,
    }
  })

  if (values.length === 0) {
    return [
      {
        contentType: "application/json",
        quality: 1.0,
      },
    ]
  }

  return values.sort(
    (left: MulticolourAcceptHeaderValue, right: MulticolourAcceptHeaderValue) =>
      right.quality - left.quality,
  )
}

function HeaderParser(
  request: IncomingMessage,
  context: MulticolourReplyContext = { responseHeaders: {} },
): MulticolourParsedHeaders {
  if (!request) {
    throw new MulticolourHttpError({
      statusCode: 500,
      error: {
        message:
          "The request handler tried to parse the request headers but failed to pass the request. This is a developer problem. Please contact the owner of this API.",
      },
    })
  }

  if (!request.headers) {
    return {
      accept: [
        {
          contentType: "application/json",
          quality: 1,
        },
      ],
    }
  }

  const accept = parseAcceptHeader(request.headers.accept)
  const contentType = parseContentTypeHeader(request.headers["content-type"])

  context.contentType = contentType

  return {
    ...request.headers,
    accept,
    "content-type": contentType,
  }
}

export { HeaderParser, parseAcceptHeader, parseContentTypeHeader }
