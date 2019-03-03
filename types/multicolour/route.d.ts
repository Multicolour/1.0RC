// @flow

import type {
  ClientRequest,
  ServerResponse,
} from "http"

export type Multicolour$RouteVerbs = 
  "GET" 
  | "POST" 
  | "PUT" 
  | "PATCH" 
  | "DELETE" 
  | "OPTIONS" 
  | "HEAD"

export type Multicolour$RouteAuthConfig = {
  type: "oauth" | "jwt" | "none",
  roles: string[],
  provider?: "google"
    | "github"
    | "facebook"
    | "twitter"
}

export type Multicolour$RouteValidations = {
  params: Object,
  queryString: Object,
  body: Object,
  response: Object,
}

export type Multicolour$RouteSpecificsConfig = {
  auth?: Multicolour$RouteAuthConfig,
}

export type Multicolour$RouteHandler = (request: ClientRequest, response: ServerResponse) => Promise<any>

export type Multicolour$Route = {
  method: Multicolour$RouteVerbs,
  path: string,
  handler: Multicolour$RouteHandler,
  config?: Multicolour$RouteSpecificsConfig,
  validate?: Multicolour$RouteValidations,
}

