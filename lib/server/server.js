// @flow

import type { Server as InsecureServer } from "http"

import type {
  Server as SecureServer,
  IncomingMessage,
  ServerResponse,
} from "https"

import type { Multicolour$APIServiceDeclaration } from "../../flow/declarations/multicolour/config.flow"

const { createServer } = require("https")

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

    this.server = createServer(this.config.TLSOptions, this.onRequest.bind(this))
  }

  onRequest(request: IncomingMessage, response: ServerResponse) {
    response.end("{hai: 'wurld'}")
  }

  listenToHTTP() {
    this.server.listen(this.config.port)
  }
}

module.exports = MulticolourServer
