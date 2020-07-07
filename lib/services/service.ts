import {
  MulticolourAPIServiceConfig,
  MulticolourDatabaseServiceConfig,
} from "../../types/multicolour/config"

import APIServer from "./api-server"

class Service {
  constructor(
    serviceDeclaration:
      | MulticolourDatabaseServiceConfig
      | MulticolourAPIServiceConfig,
  ) {
    switch (serviceDeclaration.type) {
      case "api":
        return new APIServer(serviceDeclaration)
    }
  }
}

export default Service
