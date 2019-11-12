import {
  MulticolourAPIServiceConfig,
  MulticolourSingleDatabaseConnectionConfig,
} from "../../types/multicolour/config"

import APIServer from "./api-server"

{
  class Service {
    constructor(
      serviceDeclaration:
        | MulticolourSingleDatabaseConnectionConfig
        | MulticolourAPIServiceConfig,
    ) {
      switch (serviceDeclaration.type) {
        case "api":
          return new APIServer(serviceDeclaration)
      }
    }
  }

  return new Service(workerData)
}
