import { IncomingMessage } from "http"
import { Multicolour$ReplyContext } from "./reply"

export enum Multicolour$RouteVerbs {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
  OPTIONS = "OPTIONS",
  HEAD = "HEAD",
}

export interface Multicolour$RouteAuthConfig {
  type: "oauth" | "jwt" | "none",
  roles?: string[],
  provider?: "google"
    | "github"
    | "facebook"
    | "twitter"
}

export interface Multicolour$RouteValidations {
  params: object,
  queryString: object,
  body: object,
  response: object,
}

export interface Multicolour$RouteSpecificsConfig {
  auth?: Multicolour$RouteAuthConfig,
}

export type Multicolour$RouteHandler = (request: IncomingMessage, context: Multicolour$ReplyContext) => Promise<any>

export interface Multicolour$Route {
  path: string,
  handler: Multicolour$RouteHandler,
  method: Multicolour$RouteVerbs,
  config?: Multicolour$RouteSpecificsConfig,
  validate?: Multicolour$RouteValidations,
}

export interface Multicolour$RequestParserArgs {
  request: IncomingMessage,
  maxBodySize?: number,
}
