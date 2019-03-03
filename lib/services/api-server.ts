import {
  Multicolour$SingleDatabaseConnectionConfig,
  Multicolour$APIServiceConfig,
} from "../../types/multicolour/config.flow"

import MulticolourServer from "../server/server"
import * as Promise from "bluebird"

class APIServer {
  server: MulticolourServer

  constructor(service: Multicolour$SingleDatabaseConnectionConfig | Multicolour$APIServiceConfig) {
    this.server = new MulticolourServer(service)

    this.start()
  }

  start() {
    return Promise.resolve(
      this.server.listenToHTTP()
    )
  }

  stop() {
    return this.server.gracefulStop()
  }
}

export default APIServer
