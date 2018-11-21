// @flow

import type { Server as InsecureServer } from "http"

import type {
  Server as SecureServer,
  IncomingMessage,
  ServerResponse,
} from "https"

import type { Multicolour$APIServiceDeclaration } from "../../flow/declarations/multicolour/config.flow"

const Router = require("./router")

const { 
  createServer: createSecureServer,
} = require("https")

const { 
  createServer: createInsecureServer,
} = require("http")

const Promise = require("bluebird")

class MulticolourServer {
  /**
   * The configuration for this particular service
   */
  config: Multicolour$APIServiceDeclaration

  /**
   * The actual server object.
   */
  server: SecureServer | InsecureServer

  /**
   * 
   * @param {Multicolour$APIServiceDeclaration} config for this server. 
   */
  constructor(config: Multicolour$APIServiceDeclaration) {
    this.config = config
    
    if (!this.config.secure)
      this.server = createInsecureServer(this.onRequest.bind(this))
    else
      this.server = createSecureServer(this.config.serverOptions, this.onRequest.bind(this))

    this.router = new Router()
  }

  onRequest(request: IncomingMessage, response: ServerResponse) {
    const handler = this.router.match(request.url)

    if (handler) {
      handler.handler(request, response, {})
        .then((reply: any, context: Object) => {
          response.writeHead(context.httpStatus || 200)

          if (response.toString() === "[object Object]")
            response.end(JSON.stringify(reply))
          else
            response.end(reply)
        })
    }
    else if (!handler) {
      response.writeHead(404)
      response.end({
        error: "Not found",
      })
    }
  }

  listenToHTTP() {
    return Promise.resolve(this.server.listen(this.config.port))
      .then(() => console.log(`Server started on ${this.config.port}`))
  }

  async gracefulStop() {

  }
}

module.exports = MulticolourServer
