// @flow

import type {
Multicolour$SingleDatabaseConnectionConfig,
  Multicolour$APIServiceConfig,
} from "../../flow/declarations/multicolour/config.flow"

const { workerData } = require("worker_threads")

class Service {
  constructor(serviceDeclaration: Multicolour: Multicolour$SingleDatabaseConnectionConfig | Multicolour$APIServiceConfig) {
    console.log("WORKER GOT SERVIF", serviceDeclaration)
  }

}

return new Service(workerData)
