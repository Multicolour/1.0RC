// @flow

const { EventEmitter } = require("events")

class ServerResponse extends EventEmitter {
  headers: {
    [name: string]: any,
  }

  constructor() {
    super()

    this.headers = {}
  }

  end(data: string | Buffer) {
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

module.exports = ServerResponse
