import { 
  ServerResponse,
  Server as InsecureServer,
  createServer as createInsecureServer,
} from "http"
import { 
  Server as SecureServer,
  createServer as createSecureServer,
} from "https"
import Debug from "debug"
import { Multicolour$ReplyContext } from "@mc-types/multicolour/reply"
import { Multicolour$IncomingMessage } from "@mc-types/multicolour/incoming-message"
import { Multicolour$APIServiceConfig } from "@mc-types/multicolour/config"
import { Multicolour$ContentNegotiator } from "@mc-types/multicolour/content-negotiation"

import Router from "./router"
import { HeaderParser } from "./request-parsers/header-parser"
import JsonNegotiator from "./request-parsers/parsers/json"
import MultipartNegotiator from "./request-parsers/parsers/multipart"

const debug = Debug("multicolour:server")

class MulticolourServer {
  config: Multicolour$APIServiceConfig
  server: SecureServer | InsecureServer
  router: Router
  negotiators: {
    [acceptHeaderValue: string]: Multicolour$ContentNegotiator<string>,
  }

  /**
   * 
   * @param {Multicolour$APIServiceConfig} config for this server. 
   */
  constructor(config: Multicolour$APIServiceConfig) {
    this.config = config
    this.negotiators = {}
    
    if (!this.config.secure) {
      debug("Creating insecure server because this.config.secure either isn't set or is set to a falsey value.")
      this.server = createInsecureServer(this.onRequest.bind(this))
    }
    else {
      debug("Creating a secure server with %O.", this.config.secureServerOptions)
      this.server = createSecureServer(this.config.secureServerOptions, this.onRequest.bind(this))
    }

    this.router = new Router()

    this
      .addContentNegotiator(JsonNegotiator)
      .addContentNegotiator(MultipartNegotiator)
  }

  onResponseError(request: Multicolour$IncomingMessage, response: ServerResponse, error: Multicolour$HttpError) {
    debug("An irrecoverable error occured, please fix this and add a test to prevent this error occuring again. If you believe this to be a bug with Multicolour, please submit a bug report to https://github.com/Multicolour/multicolour/issues/new. \n\nError: %O\nMethod: %s,\nStack: %O", error, request.method, error.stack) // eslint-disable-line max-len
    response.writeHead(error.statusCode || 500)
    response.end(JSON.stringify({
      error: "Something went wrong server side, there wasn't anything that could be done. This is a developer problem, please contact the owner of this service to remedy this situation.", // eslint-disable-line max-len
    }))

    return error
  }

  async onRequest(request: Multicolour$IncomingMessage, response: ServerResponse): Promise<ServerResponse> {
    const routeMatch = this.router.match(request.method, request.url)
    const context: Multicolour$ReplyContext = {
      statusCode: 200,
      responseHeaders: {
        "content-type": "application/json",
      },
    }

    if (!routeMatch || !routeMatch.handler) {
      response.writeHead(404)
      response.end(JSON.stringify({
        error: "Not found",
      }))

      return Promise.reject(response)
    }

    if (!routeMatch.handler.call) {
      response.writeHead(500)
      response.end(JSON.stringify({
        error: "A handler is present to handle this request but it is not a callable function. This is a developer problem and you should contact the owner of this service to rectify this issue.", // eslint-disable-line max-len
      }))

      return Promise.reject(response)
    }

    // Add headers to the request.
    request.parsedHeaders = HeaderParser(request, context)

    return routeMatch.handler(request, context)
      .then((reply: any) => {
        response.writeHead(context.statusCode || 200, context.responseHeaders)

        if (!reply || (typeof reply === "string" && reply.length === 0))
          response.end("{}")
        else if (reply.toString() === "[object Object]")
          response.end(JSON.stringify(reply))
        else
          response.end(reply)

        return reply
      }, this.onResponseError.bind(this, request, response))
      .catch(this.onResponseError.bind(this, request, response))
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

    return this
  }
}

export default MulticolourServer

