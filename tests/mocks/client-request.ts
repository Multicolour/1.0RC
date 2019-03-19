import EventEmitter from "events"
import { IncomingMessage as NodeIncomingMessage } from "http"
import { Socket } from "net"

interface Options {
  url: string,
  method?: string,
  body?: Buffer,
  headers?: object,
}

class IncomingMessage
  extends NodeIncomingMessage {
  public url: string
  public method?: string  = "GET"
  public body?: Buffer

  constructor(options: Options) {
    super(new Socket({}))
    this.url = options.url
    this.method = options.method
    this.body = options.body
    EventEmitter.call(this)
  }
}

export default IncomingMessage
