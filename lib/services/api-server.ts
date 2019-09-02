import {
  Multicolour$APIServiceConfig,
  Multicolour$DatabaseServiceConfig,
} from "@mc-types/multicolour/config"

import MulticolourServer from "../server/server"

class APIServer {
  public server: MulticolourServer

  constructor(
    service: Multicolour$DatabaseServiceConfig | Multicolour$APIServiceConfig,
  ) {
    this.server = new MulticolourServer(service)

    this.start().catch((startingError: Error) => {
      // @TODO: Come and make a pretty error with stack for this eventuality
      // IE: Port already assigned, not enough privileges, etc.
      throw startingError
    })
  }

  public start() {
    return Promise.resolve(this.server.listenToHTTP())
  }

  public stop() {
    return this.server.gracefulStop()
  }
}

export default APIServer
