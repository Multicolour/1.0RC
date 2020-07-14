import { IncomingMessage } from "http"
import { MulticolourRoute } from "./route"

export interface MulticolourThreadMessage {
  readonly type: "dependency-request"
  readonly serviceName: string
  readonly route: MulticolourRoute
  readonly request: IncomingMessage
}
