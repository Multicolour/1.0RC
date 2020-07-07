import { IncomingMessage } from "http"
import { MulticolourReplyContext } from "./reply"

export enum MulticolourRouteVerbs {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
  OPTIONS = "OPTIONS",
  HEAD = "HEAD",
}

export interface MulticolourRouteAuthConfig {
  type: "oauth" | "jwt" | "none"
  roles?: string[]
  provider?: "google" | "github" | "facebook" | "twitter"
}

export interface MulticolourRouteValidations {
  params: Record<string, unknown>
  queryString: Record<string, unknown>
  body: Record<string, unknown>
  response: Record<string, unknown>
}

export interface MulticolourRouteSpecificsConfig {
  auth?: MulticolourRouteAuthConfig
}

export type MulticolourRouteHandler<ModelShape> = (
  request: IncomingMessage,
  context: MulticolourReplyContext,
) => Promise<ModelShape | ModelShape[]>

export interface MulticolourRoute<Model> {
  path: string
  handler: MulticolourRouteHandler<Model>
  method: MulticolourRouteVerbs
  config?: MulticolourRouteSpecificsConfig
  validate?: MulticolourRouteValidations
}

export interface MulticolourRequestParserArgs {
  request: IncomingMessage
  maxBodySize?: number
}
