// @flow

import type {
  ClientRequest,
  ServerResponse,
} from "http"

export type Multicolour$RouteVerbs = "get" | "post" | "put" | "patch" | "delete" | "options" | "head"

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

