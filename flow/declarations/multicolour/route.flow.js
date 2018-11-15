// @flow

import type {
  Request,
  Response,
} from "http"

const { METHODS } = require("http")

export type Multicolour$StaticRouteDictionary = {
  [method: $Keys<METHODS>]: {
    [pathName: string]: Multicolour$Route,
  }
}

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

export type Multicolour$RouteHandler = (request: Request, response: Response) => Promise<any>

export type Multicolour$Route = {
  method: $Keys<METHODS>,
  path: string,
  handler: Multicolour$RouteHandler,

  auth?: Multicolour$RouteAuthConfig,
  validate?: Multicolour$RouteValidations,
}

