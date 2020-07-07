import { MulticolourIncomingMessage } from "@lib/server/incoming-message"
import { EventEmitter } from "events"
import { Server, ServerResponse } from "http"

// This exists to fix the uncaughtException event not
// being part of the @types/node thing.
// @TODO: PR to add that event name.
declare namespace NodeJS {
  interface Process extends EventEmitter {
    on(event: string, callback: (...args: unknown[]) => void): this
  }
}

declare module "http" {
  // tslint:disable-next-line:max-line-length
  function createServer(
    options: ServerOptions,
    requestListener?: (
      request: MulticolourIncomingMessage,
      response: ServerResponse,
    ) => void,
  ): Server
}

declare module "https" {
  // tslint:disable-next-line:max-line-length
  function createServer(
    options: ServerOptions,
    requestListener?: (
      request: MulticolourIncomingMessage,
      response: ServerResponse,
    ) => void,
  ): Server
}
