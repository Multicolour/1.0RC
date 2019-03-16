export interface Multicolour$ReplyContext {
  contentType?: Multicolour$ContentTypeHeader,
  responseHeaders: object,
  statusCode?: number,
}

export interface Multicolour$AcceptHeaderValue {
  contentType: string,
  quality: number,
}

export type Multicolour$AcceptHeader = Multicolour$AcceptHeaderValue | Multicolour$AcceptHeaderValue[]

export interface Multicolour$ContentTypeHeader {
  contentType?: string,
  boundary?: string,
  charset?: string,
}

