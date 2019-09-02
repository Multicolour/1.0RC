import Multicolour$HttpError from "@lib/better-errors/http-error"
// import ServerError from "@lib/better-errors/server-error"
import { Multicolour$ContentNegotiator } from "@lib/content-negotiators/base"
import { Multicolour$APIServiceConfig } from "@mc-types/multicolour/config"
import {
  Multicolour$ReplyContext,
  Multicolour$ResponseParserArgs,
} from "@mc-types/multicolour/reply"
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
import { HeaderParser } from "./request-parsers/header-parser"
// import MultipartNegotiator from "./request-parsers/parsers/multipart"
import Router from "./router"

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

    const serverOptions = {
      IncomingMessage: Multicolour$IncomingMessage,
    }

    if (!this.config.secure) {
      debug(
        "Creating insecure server because this.config.secure either isn't set or is set to a falsey value.",
      )
      this.server = createInsecureServer(
        serverOptions,
        this.onRequest.bind(this),
      )
    } else if (this.config.secure && this.config.secureServerOptions) {
      debug(
        "Creating a secure server with %O.",
        this.config.secureServerOptions,
      )
      this.server = createSecureServer(
        {
          ...this.config.secureServerOptions,
          ...serverOptions,
        },
        this.onRequest.bind(this),
      )
    } else {
      // tslint:disable-next-line:max-line-length
      debug(
        "Creating insecure server because this.config.secure either isn't set or is set to a falsey value or you havent set secureServerOptions in this servervice config.",
      )
      this.server = createInsecureServer(
        serverOptions,
        this.onRequest.bind(this),
      )
    }

    this.addContentNegotiator("application/json", JsonNegotiator)
    // .addContentNegotiator("multipart/form-data", MultipartNegotiator)
  }

  public async onResponseError(
    request: Multicolour$IncomingMessage,
    response: ServerResponse,
    context: Multicolour$ReplyContext,
    error: Multicolour$HttpError,
  ) {
    const reply = await this.runResponseParser({
      reply: {
        error: error.message,
      },
      context,
      response,
      request,
    })

    // tslint:disable-next-line:max-line-length
    debug(
      "An irrecoverable error occured, please fix this and add a test to prevent this error occuring again. If you believe this to be a bug with Multicolour, please submit a bug report to https://github.com/Multicolour/multicolour/issues/new. \n\nError: %O\nMethod: %s,\nStack: %O",
      error,
      request.method,
      error.stack,
    )

    response.writeHead(error.statusCode || 500, context.responseHeaders)
    response.end(reply)

    return {
      reply,
      context,
    }
  }

  public async onRequest(
    request: Multicolour$IncomingMessage,
    response: ServerResponse,
  ) {
    const routeMatch = this.router.match(
      this.getEnumValueFromRequest(request.method),
      request.url,
    )
    const context: Multicolour$ReplyContext = {
      statusCode: 200,
      responseHeaders: {
        "content-type": "application/json",
      },
    }

    if (!routeMatch || !routeMatch.handle) {
      response.writeHead(404)
      response.end(
        JSON.stringify({
          error: "Not found",
        }),
      )
      return
    }

    if (!routeMatch.handle.call) {
      response.writeHead(500)
      response.end(
        JSON.stringify({
          // tslint:disable-next-line:max-line-length
          error:
            "A handler is present to handle this request but it is not a callable function. This is a developer problem and you should contact the owner of this service to rectify this issue.",
        }),
      )

      return
    }

    // Add headers to the request.
    request.parsedHeaders = HeaderParser(request, context)

    // Run the registered handler for this route.
    return (
      routeMatch
        .handle(request, context)

        // Then run the response parser.
        .then((reply: any) =>
          this.runResponseParser({
            reply,
            context,
            response,
            request,
          }),
        )

        // Then reply with all of our data.
        .then((reply: string) => {
          response.writeHead(context.statusCode || 200, context.responseHeaders)

          response.end(reply)

          return {
            reply,
            context,
          }
        }, this.onResponseError.bind(this, request, response, context))
        .catch(this.onResponseError.bind(this, request, response, context))
    )
  }

  public runResponseParser(
    responseConfig: Multicolour$ResponseParserArgs,
  ): Promise<any> {
    let negotiatorIndex = 0
    let targetNegotiator
    const requestedNegotiators = responseConfig.request.parsedHeaders.accept

    while (
      negotiatorIndex <= requestedNegotiators.length &&
      !targetNegotiator
    ) {
      const contentType = requestedNegotiators[negotiatorIndex].contentType
      if (this.negotiators.hasOwnProperty(contentType)) {
        targetNegotiator = this.negotiators[contentType]
      } else {
        negotiatorIndex += 1
      }
    }

    if (!targetNegotiator) {
      return Promise.reject(
        new Multicolour$HttpError({
          statusCode: 400,
          error: {
            // tslint:disable-next-line:max-line-length
            message:
              "Couldn't find a content negotiator that could confidently handle this request for you, your accept header in the request either has a typo or the creator of this API server has not included the appropriate plugin to handle the requested content format.",
            acceptHeaderRecieved: responseConfig.request.parsedHeaders.accept,
          },
        }),
      )
    }

    return targetNegotiator.parseResponse(responseConfig)
  }

  public route(route: Multicolour$Route) {
    this.router[route.method](route)
    return this
  }

  /* istanbul ignore next */
  public async listenToHTTP() {
    return (
      Promise.resolve(this.server.listen(this.config.port))
        // tslint:disable-next-line:no-console
        .then(() => console.log(`Server started on ${this.config.port}`))
    )
  }

  /* istanbul ignore next */
  public async gracefulStop() {
    return Promise.resolve(this.server.close())
  }

  public addContentNegotiator(
    negotiationAccept: string,
    Negotiator: typeof Multicolour$ContentNegotiator,
  ) {
    this.negotiators[negotiationAccept] = new Negotiator()

    return this
  }

  private getEnumValueFromRequest(
    inputMethod?: string,
  ): Multicolour$RouteVerbs {
    const method: Multicolour$RouteVerbs =
      Multicolour$RouteVerbs[inputMethod as keyof typeof Multicolour$RouteVerbs]
    if (!method) {
      return Multicolour$RouteVerbs.GET
    }
    return Multicolour$RouteVerbs[method]
  }
}

export default MulticolourServer
