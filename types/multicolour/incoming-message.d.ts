// @flow

import { IncomingMessage } from "http"

import {
  AcceptHeader,
  ContentTypeHeader,
} from "../../../lib/server/request-parsers/header-parser"

export type Multicolour$ParsedHeaders = {
    accept: AcceptHeader,
    "content-type"?: ContentTypeHeader,
    [header: string]: string,
  }

export type Multicolour$ParsedBody= {
  [key: string]: string,
}

export type Multicolour$IncomingMessage = IncomingMessage & {
  parsedHeaders: Multicolour$ParsedHeaders,
  parsedBody: Multicolour$ParsedBody,
}
