import {
  Multicolour$SingleDatabaseConnectionConfig,
  Multicolour$APIServiceConfig,
} from "../../types/multicolour/config"

import { workerData } from "worker_threads"
import APIServer from "./api-server"

class Service {
  constructor(serviceDeclaration: Multicolour$SingleDatabaseConnectionConfig | Multicolour$APIServiceConfig) {
    switch (serviceDeclaration.type) {
    case "api":
      return new APIServer(serviceDeclaration)
    }
  }
}

return new Service(workerData)
