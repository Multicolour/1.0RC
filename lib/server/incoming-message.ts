import { IncomingMessage } from "http"
import { Socket } from "net"

import {
  Multicolour$AcceptHeader,
  Multicolour$ContentTypeHeader,
} from "@mc-types/multicolour/reply"

export interface Multicolour$ParsedHeaders {
  accept: Multicolour$AcceptHeader,
  "content-type"?: Multicolour$ContentTypeHeader,
}

export interface Multicolour$ParsedBody {
  [key: string]: string,
}

export class Multicolour$IncomingMessage extends IncomingMessage {
  public parsedHeaders: Multicolour$ParsedHeaders
  public parsedBody: Multicolour$ParsedBody

  constructor(socket: Socket) {
    super(socket)
    this.parsedHeaders = {
      "accept": [{
        contentType: "application/json",
        quality: 1.0,
      }],
      "content-type": [{
        contentType: "application/json",
      }],
    }

    this.parsedBody = {}
  }
}
