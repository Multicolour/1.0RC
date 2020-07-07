import { OutgoingHttpHeaders, ServerResponse } from "http"

import { MulticolourIncomingMessage } from "@lib/server/incoming-message"

export interface MulticolourReplyContext {
  contentType?: MulticolourContentTypeHeader
  responseHeaders: OutgoingHttpHeaders
  statusCode?: number
}

export interface MulticolourAcceptHeaderValue {
  contentType: string
  quality: number
}

export type MulticolourAcceptHeader = MulticolourAcceptHeaderValue[]

export interface MulticolourContentTypeHeader {
  contentType?: string
  boundary?: string
  charset?: string
}

export interface MulticolourResponseParserArgs {
  reply: unknown
  context: MulticolourReplyContext
  response: ServerResponse
  request: MulticolourIncomingMessage
}
