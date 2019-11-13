import {
  MulticolourIncomingMessage,
  MulticolourParsedBody,
  MulticolourParsedHeaders,
} from "@lib/server/incoming-message"
import { IncomingHttpHeaders } from "http"
import { Socket } from "net"

interface Options {
  url: string
  method?: string
  body?: Buffer
  headers?: IncomingHttpHeaders
}

class IncomingMessage extends MulticolourIncomingMessage {
  public url: string
  public method?: string = "GET"
  public body?: Buffer
  public parsedHeaders: MulticolourParsedHeaders = {
    accept: [
      {
        contentType: "application/json",
        quality: 1,
      },
    ],
  }
  public parsedBody: MulticolourParsedBody = {}

  constructor(options: Options) {
    super(new Socket({}))
    this.url = options.url
    this.method = options.method
    this.body = options.body
    this.headers = options.headers || {}
  }
}

export default IncomingMessage
