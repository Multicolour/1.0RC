import {
  ClientRequest,
  ServerResponse,
} from "http"

export type Multicolour$RouteVerbs = "GET" 
  | "POST" 
  | "PUT" 
  | "PATCH" 
  | "DELETE" 
  | "OPTIONS" 
  | "HEAD"

export interface Multicolour$RouteAuthConfig {
  type: "oauth" | "jwt" | "none",
  roles: string[],
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

export type Multicolour$RouteHandler = (request: ClientRequest, response: ServerResponse) => Promise<any>

export interface Multicolour$Route {
  method: Multicolour$RouteVerbs,
  path: string,
  handler: Multicolour$RouteHandler,
  config?: Multicolour$RouteSpecificsConfig,
  validate?: Multicolour$RouteValidations,
}

