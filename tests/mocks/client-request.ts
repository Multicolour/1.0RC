import EventEmitter from "events"
import { IncomingMessage as NodeIncomingMessage } from "http"

interface Options {
  url: string,
  method?: string,
  body?: Buffer,
  headers?: object,
}

class IncomingMessage 
  extends EventEmitter
  implements NodeIncomingMessage {
  url: string
  method?: string  = "GET"
  body?: Buffer 

  constructor(options: Options) {
    super()
    this.url = options.url
    this.method = options.method
    this.body = options.body
  }
}

export default IncomingMessage
