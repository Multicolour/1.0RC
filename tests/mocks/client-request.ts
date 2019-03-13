import EventEmitter from "events"
import { Socket } from "net"
import { IncomingMessage as NodeIncomingMessage } from "http"

interface Options {
  url: string,
  method?: string,
  body?: Buffer,
  headers?: object,
}

class IncomingMessage 
  extends NodeIncomingMessage {
  url: string
  method?: string  = "GET"
  body?: Buffer 

  constructor(options: Options) {
    super(new Socket({}))
    this.url = options.url
    this.method = options.method
    this.body = options.body
    EventEmitter.call(this)
  }
}

export default IncomingMessage
