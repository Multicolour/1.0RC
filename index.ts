// Catch uncaught errors and promises to present them nicely.
import "./lib/uncaught-error-handlers"

import ServiceNetworkBridge from "./lib/services/service-bridge"
import { Multicolour$Config } from "./types/multicolour/config"
import { Multicolour$ModelsObject } from "./types/multicolour/model"

import configValidator from "./lib/config"
import { getModels } from "./lib/models"
import Services from "./lib/services/services"


class Multicolour {
  public config!: Multicolour$Config
  public serviceBridge!: ServiceNetworkBridge
  public models!: Multicolour$ModelsObject

  constructor(config: Multicolour$Config) {
    // Get and validate the provided config.
    try {
      this.config = configValidator(config)
    } catch (error) {
      console.error(error.prettify ? error.prettify() : error)
      process.exit(-1)
    }

    // tslint:disable-next-line:max-line-length no-console
    console.info("Config syntax looks good, nice work.\nNow, on to resolving, compiling and setting up your models")

    try {
      this.models = this.getModels()
    } catch (error) {
      console.error(error.prettify ? error.prettify() : error)
      process.exit(-1)
    }

    // tslint:disable-next-line:max-line-length no-console
    console.info("Models syntax checked and set up, now service dependency sorting and resolution.")

    try {
      this.sortServicesAndPrepareWorkers()
    } catch (error) {
      console.error(error.prettify ? error.prettify() : error) // eslint-disable-line no-console
      process.exit(-1)
    }

    // tslint:disable-next-line:max-line-length no-console
    console.info("All services check out okay, dependencies all resolve and service workers are ready to be prepared.")
  }

  public getModels(): Multicolour$ModelsObject {
    return getModels(this.config.models)
  }

  public sortServicesAndPrepareWorkers() {
    const servicesManager = new Services()

    const startOrder = servicesManager
      .validateAndSortServicesByDependencies(this.config.services)

    this.serviceBridge = servicesManager
      .getServiceNetworkBridge(this.config.services, startOrder)
  }

  public async start() {
    return this.serviceBridge.startServices()
  }

  public async stop() {
    return this.serviceBridge.stopServices()
  }
}

export default Multicolour

