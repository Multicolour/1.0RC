import EventEmitter from "events"

class ClientRequest extends EventEmitter {
  url: string
  method: string
  body: string

  constructor(options: Object = {}) {
    super()
    this.url = options.url
    this.method = options.method
    this.body = options.body
    this.headers = options.headers
  }
}

export default ClientRequest
