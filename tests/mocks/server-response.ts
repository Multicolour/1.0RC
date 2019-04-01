import { ServerResponse as NativeResponse } from "http"
import { IncomingMessage } from "./http"

class ServerResponse
extends NativeResponse {
  public headers: {
    [name: string]: any,
  }
  public body: string | Buffer
  public statusCode: number

  constructor(req: IncomingMessage) {
    super(req)

    this.body = ""
    this.headers = {}
    this.statusCode = 200
  }

  public end(chunk: any, encoding: string, cb?: (() => void) | undefined) {
    this.body = data
    return data
  }

  public hasHeader(name: string): boolean {
    return Boolean(this.headers[name.toLowerCase()])
  }

  public getHeader(name: string): void | string {
    return this.headers[name.toLowerCase()]
  }

  public setHeader(name: string, value: string | number) {
    this.headers[name.toLowerCase()] = value
    return this
  }

  public writeHead(statusCode: number, headers: object) {
    this.statusCode = statusCode
    this.headers = {
      ...this.headers,
      ...headers,
    }

    return this
  }
}

export default ServerResponse
