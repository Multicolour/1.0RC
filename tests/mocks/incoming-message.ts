import {
  Multicolour$IncomingMessage,
  Multicolour$ParsedBody,
  Multicolour$ParsedHeaders,
} from "@lib/server/incoming-message"
import { Socket } from "net"

interface Options {
  url: string,
  method?: string,
  body?: Buffer,
  headers?: object,
}

class IncomingMessage
  extends Multicolour$IncomingMessage {
  public url: string
  public method?: string  = "GET"
  public body?: Buffer
  public parsedHeaders: Multicolour$ParsedHeaders = {
    accept: {
      contentType: "application/json",
      quality: 1,
    },
  }
  public parsedBody: Multicolour$ParsedBody = {}


  constructor(options: Options) {
    super(new Socket({}))
    this.url = options.url
    this.method = options.method
    this.body = options.body
  }
}

export default IncomingMessage
