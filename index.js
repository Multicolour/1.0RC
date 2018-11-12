// @flow

// Catch uncaught errors and promises to present them nicely.
require("./lib/uncaught-error-handlers")

import type { 
  Multicolour$Config,
} from "./flow/declarations/multicolour/config.flow"

const configValidator = require("./lib/config")
const Services = require("./lib/services/services")

Error.stackTraceLimit = Infinity

class Multicolour {
  config: Multicolour$Config
  serviceBridge: ServiceNetworkBridge

  constructor(config: Multicolour$Config) {
    // Get and validate the provided config.
    try {
      this.config = configValidator(config)
    }
    catch (error) {
      console.error(error.prettify ? error.prettify() : error) // eslint-disable-line
      process.exit(-1)
    }
    finally {
      console.info("Config syntax looks good, nice work.\nNow, on to service dependency sorting and resolution.") // eslint-disable-line
    }

    try {
      this.sortServicesAndPrepareWorkers()
    }
    catch (error) {
      console.error(error.prettify ? error.prettify() : error) // eslint-disable-line
      process.exit(-1)
    }
    finally {
      console.info("All services check out okay, dependencies all resolve and service workers are ready to be prepared.") // eslint-disable-line
    }
  }

  async sortServicesAndPrepareWorkers() {
    const servicesManager = new Services()

    const startOrder = servicesManager
      .validateAndSortServicesByDependencies(this.config.services)
      
    this.serviceBridge = servicesManager
      .getServiceNetworkBridge(this.config.services, startOrder)
  }

  async getUserDefinedModels() {
    const { resolve } = require("path")
    const path = resolve(this.config.models)
  }

  async start() {
    return this.serviceBridge.startServices()
  }

  async stop() {
    
  }
}

module.exports = Multicolour
