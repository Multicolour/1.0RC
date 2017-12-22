// @flow

import type {
  Server,
  IncomingMessage,
  ServerResponse,
} from "http"

const { createServer } = require("https")

class MulticolourServer {
  /**
   * The configuration for this particular service
   */
  config: Multicolour$APIServiceDeclaration

  /**
   * The actual server object.
   */
  server: Server

  serviceNetworkBridge: ServiceNetworkBridge

  /**
   * 
   * @param {Multicolour$APIServiceDeclaration} config for this server. 
   */
  constructor(config: Multicolour$APIServiceDeclaration) {
    this.config = config

    this.server = createServer(this.config.TLSOptions, this.onRequest.bind(this))
  }

  onRequest(request: IncomingMessage, response: ServerResponse) {

  }

  listenToHTTP() {
    this.server.listen(this.config.port)
  }
}

module.exports = MulticolourServer
