// @flow

import type { Server as InsecureServer } from "http"
import type { Debug } from "debug"
import type {
  Server as SecureServer,
  IncomingMessage,
  ServerResponse,
} from "https"

import type { Multicolour$APIServiceDeclaration } from "../../flow/declarations/multicolour/config.flow"
import type { Multicolour$ContentNegotiator } from "../../flow/declarations/multicolour/content-negotiation.flow"

const Router = require("./router")
const bodyParser = require("./body-parser/body-parser")

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
  debug: Debug
  negotiators: {
    [acceptHeaderValue: string]: Multicolour$ContentNegotiator,
  }

  /**
   * 
   * @param {Multicolour$APIServiceDeclaration} config for this server. 
   */
  constructor(config?: Multicolour$APIServiceDeclaration = {}) {
    this.debug = debug("multicolour:server")
    this.config = config
    this.negotiators = {}
    
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

  async onRequest(request: IncomingMessage, response: ServerResponse): Promise<ServerResponse> {
    const routeMatch = this.router.match(request.method, request.url)
    const context = {}

    if (!routeMatch.handler) {
      response.writeHead(404)
      response.end(JSON.stringify({
        error: "Not found",
      }))

      return Promise.reject(response)
    }

    if (!(routeMatch.handler instanceof Function)) {
      response.writeHead(500)
      response.end(JSON.stringify({
        error: "A handler is present to handle this request but it is not a callable function. This is a developer problem and you should contact the owner of this service to rectify this issue.", // eslint-disable-line max-len
      }))

      return Promise.reject(response)
    }


    return routeMatch.handler(request, context)
      .then((reply: any) => {
        response.writeHead(context.statusCode || 200, context.headers)

        if (!reply || (typeof reply === "string" && reply.length === 0))
          response.end("{}")
        else if (reply.toString() === "[object Object]")
          response.end(JSON.stringify(reply))
        else
          response.end(reply)

        return response
      })
      .catch((error: Error) => {
        this.debug("An irrecoverable error occured, please fix this and add a test to prevent this error occuring again. If you believe this to be a bug with Multicolour, please submit a bug report to https://github.com/Multicolour/multicolour/issues/new. \n\nError: %O\nMethod: %s,\nBody: %O,\nStack: %O", error, request.method, request.body, error.stack) // eslint-disable-line max-len
        response.writeHead(error.statusCode || 500)
        response.end(JSON.stringify({
          error: "Something went wrong server side, there wasn't anything that could be done. This is a developer problem, please contact the owner of this service to remedy this situation.", // eslint-disable-line max-len
        }))

        return Promise.reject(response)
      })
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

  addContentNegotiator(Negotiator: Multicolour$ContentNegotiator) {
    const negotiatorIsClass = typeof Negotiator === "function" && /^\s*class\s+/.test(Negotiator.toString())

    let registration = Negotiator

    if (negotiatorIsClass) {
      const negotiator = new Negotiator()
      registration = negotiator.parseBody.bind(negotiator)
    }

    this.negotiators[Negotiator.negotiationAccept] = registration
  }
}

module.exports = MulticolourServer
