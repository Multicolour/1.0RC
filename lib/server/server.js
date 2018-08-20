// @flow

import type {
  Server,
  IncomingMessage,
  ServerResponse,
} from "http"

import Promise from "bluebird"
import type { APIServiceDeclaration } from "@flow/multicolour/config.flow"

const http = require("http")
const https = require("https")

class MulticolourServer {
  server: Server

  constructor(options: APIServiceDeclaration) {
    if (process.env.NODE_ENV !== "production")
      this.server = this.createInsecureServer(options)
    else
      this.server = this.createSecureServer(options)
  }

  createInsecureServer(options: APIServiceDeclaration): Server {
    return http.createServer(this.handleAPIRequest.bind(this))
  }

  createSecureServer(options: APIServiceDeclaration): Server {
    return https.createServer({ ...options }, this.handleAPIRequest.bind(this))
  }

  handleAPIRequest(req: IncomingMessage, res: ServerResponse): void {
    
  }

  async start(options: APIServiceDeclaration): Promise<Server> {
    return new Promise((resolve: (thenableOrResult?: any) => void, reject: (error?: any) => void) => {
      this.server.listen(options, )
    })
  }
}

module.exports = MulticolourServer
