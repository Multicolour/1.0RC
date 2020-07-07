import { IncomingMessage } from "http"
import { Multicolour$Route } from "./route"

export interface Multicolour$ThreadMessage {
  readonly type: "dependency-request"
  readonly serviceName: string
  readonly route: Multicolour$Route
  readonly request: IncomingMessage
}
