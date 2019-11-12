import { IncomingMessage } from "http"
import { Socket } from "net"

import {
  MulticolourAcceptHeader,
  MulticolourContentTypeHeader,
} from "@mc-types/multicolour/reply"

export interface MulticolourParsedHeaders {
  accept: MulticolourAcceptHeader
  "content-type"?: MulticolourContentTypeHeader
}

export interface MulticolourParsedBody {
  [key: string]: string
}

export class MulticolourIncomingMessage extends IncomingMessage {
  public parsedHeaders: MulticolourParsedHeaders
  public parsedBody: MulticolourParsedBody

  constructor(socket: Socket) {
    super(socket)
    this.parsedHeaders = {
      accept: [
        {
          contentType: "application/json",
          quality: 1.0,
        },
      ],
      "content-type": {
        contentType: "application/json",
      },
    }

    this.parsedBody = {}
  }
}
