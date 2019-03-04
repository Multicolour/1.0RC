import { EventEmitter } from "events"

class ServerResponse extends EventEmitter {
  headers: {
    [name: string]: any,
  }
  body: string | Buffer
  statusCode: number

  constructor() {
    super()

    this.body = ""
    this.headers = {}
  }

  end(data: string | Buffer) {
    this.body = data
    return data
  }

  hasHeader(name: string): boolean {
    return Boolean(this.headers[name.toLowerCase()])
  }

  getHeader(name: string): ?string {
    return this.headers[name.toLowerCase()]
  }

  setHeader(name: string, value: string | number) {
    this.headers[name.toLowerCase()] = value
    return this
  }

  writeHead(statusCode: number, headers: Object) {
    this.statusCode = statusCode
    this.headers = {
      ...this.headers,
      ...headers,
    }

    return this
  }
}

export default ServerResponse
