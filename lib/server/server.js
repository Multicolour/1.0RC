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
    response.writeHead(200)
    response.end("{hai: 'wurld'}")
  }

  listenToHTTP() {
    return Promise.resolve(this.server.listen(this.config.port))
      .then(() => console.log(`Server started on ${this.config.port}`))
  }
}

module.exports = MulticolourServer
