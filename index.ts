// Catch uncaught errors and promises to present them nicely.
import "./lib/uncaught-error-handlers"

import { Multicolour$Config } from "./types/multicolour/config"
import { Multicolour$ModelsObject } from "./types/multicolour/model"
import ServiceNetworkBridge from "./lib/services/service-bridge"

import configValidator from "./lib/config"
import Services from "./lib/services/services"
import { getModels } from "./lib/models"


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
      
    console.info("Config syntax looks good, nice work.\nNow, on to resolving, compiling and setting up your models") // eslint-disable-line 

    try {
      this.models = this.getModels()
    }
    catch (error) {
      console.error(error.prettify ? error.prettify() : error) // eslint-disable-line no-console
      process.exit(-1)
    }
      
    console.info("Models syntax checked and set up, now service dependency sorting and resolution.") // eslint-disable-line 

    try {
      this.sortServicesAndPrepareWorkers()
    }
    catch (error) {
      console.error(error.prettify ? error.prettify() : error) // eslint-disable-line no-console
      process.exit(-1)
    }

    console.info("All services check out okay, dependencies all resolve and service workers are ready to be prepared.") // eslint-disable-line 
  }

  getModels(): Multicolour$ModelsObject {
    return getModels(this.config.models)
  }

  sortServicesAndPrepareWorkers() {
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

