import { IncomingMessage } from "http"

import {
  Multicolour$AcceptHeader,
  Multicolour$AcceptHeaderValue,
  Multicolour$ContentTypeHeader,
  Multicolour$ReplyContext,
} from "@mc-types/multicolour/reply"

export interface Multicolour$ParsedHeaders {
  accept: Multicolour$AcceptHeader,
  "content-type"?: Multicolour$ContentTypeHeader,
  [header: string]: string,
}

export interface Multicolour$ParsedBody {
  [key: string]: string,
}

export class Multicolour$IncomingMessage
  extends IncomingMessage {
  public parsedHeaders: Multicolour$ParsedHeaders
  public parsedBody: Multicolour$ParsedBody
}
