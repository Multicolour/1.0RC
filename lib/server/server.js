// @flow

import type { Server as InsecureServer } from "http"

import type {
  Server as SecureServer,
  IncomingMessage,
  ServerResponse,
} from "https"

import type { Multicolour$APIServiceDeclaration } from "../../flow/declarations/multicolour/config.flow"

const HttpError = require("../better-errors/http-error")
const Router = require("./router")

const { 
  createServer: createSecureServer,
} = require("https")

const { 
  createServer: createInsecureServer,
} = require("http")

const Promise = require("bluebird")
const debug = require("debug")

class MulticolourServer {
  config: Multicolour$APIServiceDeclaration
  server: SecureServer | InsecureServer
  router: Router

  /**
   * 
   * @param {Multicolour$APIServiceDeclaration} config for this server. 
   */
  constructor(config?: Multicolour$APIServiceDeclaration = {}) {
    this.debug = debug("Multicolour$Server")
    this.config = config
    
    if (!this.config.secure) {
      this.debug("Creating insecure server because this.config.secure either isn't set or is set to a falsey value.")
      this.server = createInsecureServer(this.onRequest.bind(this))
    }
    else {
      this.debug("Creating a secure server with %O.", this.config.serverOptions)
      this.server = createSecureServer(this.config.serverOptions, this.onRequest.bind(this))
    }

    this.router = new Router()
  }

  onRequest(request: IncomingMessage, response: ServerResponse) {
    const routeMatch = this.router.match(request.method, request.url)
    const context = {}

    if (routeMatch.handler) {
      if (!(routeMatch.handler instanceof Function)) {
        response.writeHead(500)
        response.end(JSON.stringify({
          error: "A handler is present to handle this request but it is not a callable function. This is a developer problem and you should contact the owner of this service to rectify this issue.",
        }))

        return
      }

      routeMatch.handler(request, context)
        .then((reply: any) => {
          response.writeHead(context.httpStatus || 200, context.headers)

          if (reply.toString() === "[object Object]")
            response.end(JSON.stringify(reply))
          else
            response.end(reply)
        })
        .catch(HttpError, (error: HttpError) => {
          this.debug("A HTTP error was return from the handler for the %s to %s. :: %O", request.method, request.url, error)
          response.writeHead(error.statusCode, error.headers)
          response.end(JSON.stringify(error.errors))
        })
        .catch((error: Error) => {
          this.debug("An irrecoverable error occured, please fix this and add a test to prevent this error occuring again. If you believe this to be a bug with Multicolour, please submit a bug report to https://github.com/Multicolour/multicolour/issues/new. \n\nError: %O\nMethod: %s,\nBody: %O", error, request.method, request.body)
          response.writeHead(500)
          response.end(JSON.stringify({
            error: "Something went wrong server side, there wasn't anything that could be done. This is a developer problem, please contact the owner of this service to remedy this situation.",
          }))
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
