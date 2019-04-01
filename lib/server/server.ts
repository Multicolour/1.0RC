import Multicolour$HttpError from "@lib/better-errors/http-error"
// import ServerError from "@lib/better-errors/server-error"
import { Multicolour$ContentNegotiator } from "@lib/content-negotiators/base"
import { Multicolour$APIServiceConfig } from "@mc-types/multicolour/config"
import { Multicolour$ReplyContext } from "@mc-types/multicolour/reply"
import {
  Multicolour$Route,
  Multicolour$RouteVerbs,
} from "@mc-types/multicolour/route"
import Debug from "debug"
import {
  createServer as createInsecureServer,
  Server as InsecureServer,
  ServerResponse,
} from "http"
import {
  createServer as createSecureServer,
  Server as SecureServer,
} from "https"
import { Multicolour$IncomingMessage } from "./incoming-message"

import JsonNegotiator from "@lib/content-negotiators/json"
import { IncomingMessage } from "http"
import { HeaderParser } from "./request-parsers/header-parser"
// import MultipartNegotiator from "./request-parsers/parsers/multipart"
import Router from "./router"

interface Multicolour$ResponseParserArgs { 
  reply: any
  context: Multicolour$ReplyContext
  response: ServerResponse
  request: Multicolour$IncomingMessage 
}

const debug = Debug("multicolour:server")

class MulticolourServer {
  public config: Multicolour$APIServiceConfig
  public router: Router = new Router()
  public negotiators: {
    [acceptHeaderValue: string]: Multicolour$ContentNegotiator,
  }
  private server: SecureServer | InsecureServer

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
    else if (this.config.secure && this.config.secureServerOptions) {
      debug("Creating a secure server with %O.", this.config.secureServerOptions)
      this.server = createSecureServer(this.config.secureServerOptions, this.onRequest.bind(this))
    }
    else {
      // tslint:disable-next-line:max-line-length
      debug("Creating insecure server because this.config.secure either isn't set or is set to a falsey value or you havent set secureServerOptions in this servervice config.")
      this.server = createInsecureServer(this.onRequest.bind(this))
    }

    this
      .addContentNegotiator("application/json", JsonNegotiator)
    // .addContentNegotiator("multipart/form-data", MultipartNegotiator)
  }

  public onResponseError(request: IncomingMessage, response: ServerResponse, error: Multicolour$HttpError) {
    // tslint:disable-next-line:max-line-length
    debug("An irrecoverable error occured, please fix this and add a test to prevent this error occuring again. If you believe this to be a bug with Multicolour, please submit a bug report to https://github.com/Multicolour/multicolour/issues/new. \n\nError: %O\nMethod: %s,\nStack: %O", error, request.method, error.stack) // eslint-disable-line max-len
    response.writeHead(error.statusCode || 500)
    response.end(JSON.stringify({
      // tslint:disable-next-line:max-line-length
      error: "Something went wrong server side, there wasn't anything that could be done. This is a developer problem, please contact the owner of this service to remedy this situation.", // eslint-disable-line max-len
    }))

    return error
  }

  public async onRequest(request: IncomingMessage, response: ServerResponse) {
    const extendedRequest: Multicolour$IncomingMessage = request

    const routeMatch = this.router.match(this.getEnumValueFromRequest(request.method), extendedRequest.url)
    const context: Multicolour$ReplyContext = {
      statusCode: 200,
      responseHeaders: {
        "content-type": "application/json",
      },
    }

    if (!routeMatch || !routeMatch.handle) {
      response.writeHead(404)
      response.end(JSON.stringify({
        error: "Not found",
      }))
      return
    }

    if (!routeMatch.handle.call) {
      response.writeHead(500)
      response.end(JSON.stringify({
        // tslint:disable-next-line:max-line-length
        error: "A handler is present to handle this request but it is not a callable function. This is a developer problem and you should contact the owner of this service to rectify this issue.",
      }))

      return
    }

    // Add headers to the request.
    extendedRequest.parsedHeaders = HeaderParser(request, context)

    // Run the registered handler for this route.
    return routeMatch.handle(extendedRequest, context)
      // Then run the response parser.
      .then((reply: any) =>
        this.runResponseParser({
          reply,
          context,
          response,
          request: extendedRequest,
        }),
      )
      // Then reply with all of our data.
      .then((reply: any) => {
        response.writeHead(context.statusCode || 200, context.responseHeaders)

        response.end(reply)

        return reply
      }, this.onResponseError.bind(this, request, response))
      .catch(this.onResponseError.bind(this, request, response))
  }

  public runResponseParser(responseConfig: Multicolour$ResponseParserArgs): Promise<any> {
    const targetNegotiator = responseConfig.request.parsedHeaders.accept.contentType
    if (this.negotiators.hasOwnProperty(targetNegotiator)) {
      return this.negotiators[targetNegotiator].parseResponse(responseConfig)
    }
  }

  public route(route: Multicolour$Route) {
    this.router[route.method](route)
    return this
  }

  /* istanbul ignore next */
  public async listenToHTTP() {
    return Promise.resolve(this.server.listen(this.config.port))
      // tslint:disable-next-line:no-console
      .then(() => console.log(`Server started on ${this.config.port}`))
  }

  /* istanbul ignore next */
  public async gracefulStop() {
    return Promise.resolve(this.server.close())
  }

  public addContentNegotiator(negotiationAccept: string, Negotiator: typeof Multicolour$ContentNegotiator) {
    this.negotiators[negotiationAccept] = new Negotiator()

    return this
  }

  private getEnumValueFromRequest(inputMethod?: string): Multicolour$RouteVerbs {
    const method: Multicolour$RouteVerbs = Multicolour$RouteVerbs[inputMethod as keyof typeof Multicolour$RouteVerbs]
    if (!method) {
      return Multicolour$RouteVerbs.GET
    }
    return Multicolour$RouteVerbs[method]
  }
}

export default MulticolourServer

