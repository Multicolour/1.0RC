import { Multicolour$IncomingMessage } from "@lib/server/incoming-message"
import { EventEmitter } from "events"
import { ServerResponse, Server } from "http"

// This exists to fix the uncaughtException event not
// being part of the @types/node thing.
// @TODO: PR to add that event name.
declare namespace NodeJS {
  interface Process extends EventEmitter {
    on(event: string, callback: (...args: any[]) => void): this;
  }
}

declare module "http" {
  function createServer(options: ServerOptions, requestListener?: (request: Multicolour$IncomingMessage, response: ServerResponse) => void): Server
}

declare module "https" {
  function createServer(options: ServerOptions, requestListener?: (request: Multicolour$IncomingMessage, response: ServerResponse) => void): Server
}
