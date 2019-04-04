import {
  OutgoingHttpHeaders,
  ServerResponse,
} from "http"

import { Multicolour$IncomingMessage } from "@lib/server/incoming-message"

export interface Multicolour$ReplyContext {
  contentType?: Multicolour$ContentTypeHeader,
  responseHeaders: OutgoingHttpHeaders,
  statusCode?: number,
}

export interface Multicolour$AcceptHeaderValue {
  contentType: string,
  quality: number,
}

export type Multicolour$AcceptHeader = Multicolour$AcceptHeaderValue[]

export interface Multicolour$ContentTypeHeader {
  contentType?: string,
  boundary?: string,
  charset?: string,
}

export interface Multicolour$ResponseParserArgs {
  reply: any
  context: Multicolour$ReplyContext
  response: ServerResponse
  request: Multicolour$IncomingMessage
}
