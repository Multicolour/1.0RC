// @flow

import type { Server as InsecureServer } from "http"

import type {
  Server as SecureServer,
  IncomingMessage,
  ServerResponse,
} from "https"

import type { Multicolour$APIServiceDeclaration } from "../../flow/declarations/multicolour/config.flow"

const HTTPError = require("../better-errors/http-error")
const Router = require("./router")

const { 
  createServer: createSecureServer,
} = require("https")

const { 
  createServer: createInsecureServer,
} = require("http")

const Promise = require("bluebird")

class MulticolourServer {
  config: Multicolour$APIServiceDeclaration
  server: SecureServer | InsecureServer
  router: Router

  /**
   * 
   * @param {Multicolour$APIServiceDeclaration} config for this server. 
   */
  constructor(config?: Multicolour$APIServiceDeclaration = {}) {
    this.config = config
    
    if (!this.config.secure)
      this.server = createInsecureServer(this.onRequest.bind(this))
    else
      this.server = createSecureServer(this.config.serverOptions, this.onRequest.bind(this))

    this.router = new Router()
  }

  onRequest(request: IncomingMessage, response: ServerResponse) {
    const routeMatch = this.router.match(request.method, request.url)
    const context = {}

    if (routeMatch.handler && routeMatch.handler instanceof Function) {
      routeMatch.handler(request, context)
        .then((reply: any) => {
          response.writeHead(context.httpStatus || 200, context.headers)

          if (reply.toString() === "[object Object]")
            response.end(JSON.stringify(reply))
          else
            response.end(reply)
        })
    }
    else {
      response.writeHead(404)
      response.end(JSON.stringify({
        error: "Not found",
      }))
    }
  }

  route(route: Multicolour$Route) {
    this.router[route.method.toLowerCase()](route)
    return this
  }

  /* istanbul ignore next */
  async listenToHTTP() {
    return Promise.resolve(this.server.listen(this.config.port))
      .then(() => console.log(`Server started on ${this.config.port}`)) // eslint-disable-line
  }

  /* istanbul ignore next */
  async gracefulStop() {
    return Promise.resolve(this.server.close())
  }
}

module.exports = MulticolourServer
