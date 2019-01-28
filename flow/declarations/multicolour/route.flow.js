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
  type: string,
  roles: string[],
}

export type Multicolour$RouteValidations = {
  params: Object,
  queryString: Object,
  body: Object,
  response: Object,
}

export type Multicolour$RouteHandler = (request: ClientRequest, response: ServerResponse) => Promise<any>

export type Multicolour$Route = {
  method: Multicolour$RouteVerbs,
  path: string,
  handler: Multicolour$RouteHandler,

  auth?: Multicolour$RouteAuthConfig,
  validate?: Multicolour$RouteValidations,
}

