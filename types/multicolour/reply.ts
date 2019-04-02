import { OutgoingHttpHeaders } from "http"

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

export interface Multicolour$ContentTypeHeaderValue {
  contentType?: string,
  boundary?: string,
  charset?: string,
}

export type Multicolour$ContentTypeHeader = Multicolour$ContentTypeHeaderValue[]

