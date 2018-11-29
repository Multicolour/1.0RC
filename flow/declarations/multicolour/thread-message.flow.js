// @flow

import type { ClientRequest } from "http"
import type { Multicolour$Route } from "./route.flow"

export type Multicolour$ThreadMessage = {
  +type: "dependency-request",
  +serviceName: string,
  +route: Multicolour$Route,
  +request: ClientRequest,
}
