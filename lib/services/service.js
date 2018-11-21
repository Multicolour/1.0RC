// @flow

import type {
  Multicolour$SingleDatabaseConnectionConfig,
  Multicolour$APIServiceConfig,
} from "../../flow/declarations/multicolour/config.flow"

const { workerData } = require("worker_threads")
const APIServer = require("./api-server")

class Service {
  constructor(serviceDeclaration: Multicolour$SingleDatabaseConnectionConfig | Multicolour$APIServiceConfig) {
    switch (serviceDeclaration.type) {
    case "api":
      return new APIServer(serviceDeclaration)
    }
  }

  async gracefulStop() {

  }
}

return new Service(workerData)
