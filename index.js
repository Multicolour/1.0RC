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
      console.info("Config syntax looks good, nice work.\nOn to service dependency sortin and resolution.") // eslint-disable-line
    }

    this.sortServicesAndPrepareWorkers()
  }

  async sortServicesAndPrepareWorkers() {
    const servicesManager = new Services()

    servicesManager.validateAndSortServicesByDependencies(this.config.services)
  }

  async getUserDefinedModels() {
    const { resolve } = require("path")
    const path = resolve(this.config.models)
  }

  async start() {

  }

  async stop() {
    
  }
}

module.exports = Multicolour
