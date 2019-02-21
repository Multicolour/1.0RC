// @flow

// Catch uncaught errors and promises to present them nicely.
require("./lib/uncaught-error-handlers")

import type { Multicolour$Config } from "./flow/declarations/multicolour/config.flow"
import type { Multicolour$ModelsObject } from "./flow/declarations/multicolour/models.flow"
import type ServiceNetworkBridge from "./lib/services/service-bridge"

const configValidator = require("./lib/config")
const Services = require("./lib/services/services")
const { getModels } = require("./lib/models")

Error.stackTraceLimit = Infinity

class Multicolour {
  config: Multicolour$Config
  serviceBridge: ServiceNetworkBridge
  models: Multicolour$ModelsObject

  constructor(config: Multicolour$Config) {
    // Get and validate the provided config.
    try {
      this.config = configValidator(config)
    }
    catch (error) {
      console.error(error.prettify ? error.prettify() : error) // eslint-disable-line no-console
      process.exit(-1)
    }
    finally {
      console.info("Config syntax looks good, nice work.\nNow, on to resolving, compiling and setting up your models") // eslint-disable-line no-console
    }

    try {
      this.models = this.getModels()
    }
    catch (error) {
      console.error(error.prettify ? error.prettify() : error) // eslint-disable-line no-console
      process.exit(-1)
    }
    finally {
      console.info("Models syntax checked and set up, now service dependency sorting and resolution.") // eslint-disable-line no-console
    }

    console.log(this.models)
    try {
      this.sortServicesAndPrepareWorkers()
    }
    catch (error) {
      console.error(error.prettify ? error.prettify() : error) // eslint-disable-line no-console
      process.exit(-1)
    }
    finally {
      console.info("All services check out okay, dependencies all resolve and service workers are ready to be prepared.") // eslint-disable-line no-console
    }
  }

  getModels(): Multicolour$ModelsObject {
    return getModels(this.config.models)
  }

  async sortServicesAndPrepareWorkers() {
    const servicesManager = new Services()

    const startOrder = servicesManager
      .validateAndSortServicesByDependencies(this.config.services)
      
    this.serviceBridge = servicesManager
      .getServiceNetworkBridge(this.config.services, startOrder)
  }

  async start() {
    return this.serviceBridge.startServices()
  }

  async stop() {
    return this.serviceBridge.stopServices()   
  }
}

module.exports = Multicolour
