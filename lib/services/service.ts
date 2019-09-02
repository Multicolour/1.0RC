import {
  Multicolour$APIServiceConfig,
  Multicolour$SingleDatabaseConnectionConfig,
} from "../../types/multicolour/config"

import APIServer from "./api-server"

class Service {
  constructor(
    serviceDeclaration:
      | Multicolour$SingleDatabaseConnectionConfig
      | Multicolour$APIServiceConfig,
  ) {
    switch (serviceDeclaration.type) {
      case "api":
        return new APIServer(serviceDeclaration)
    }
  }
}

return new Service(workerData)
