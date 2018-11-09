// @flow

require("./lib/uncaught-error-handlers")

const configValidator = require("./lib/config")

import type { Multicolour$Config } from "./flow/declarations/multicolour/config.flow"

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
      console.info("Config looks good, nice work.") // eslint-disable-line
    }
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
