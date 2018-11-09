// @flow

require("./lib/uncaught-error-handlers")

const Config = require("./lib/config")

import type { Multicolour$Config } from "./flow/declarations/multicolour/config.flow"

Error.stackTraceLimit = Infinity

class Multicolour {
  constructor(config: Multicolour$Config) {
    this.config = new Config(config)

    try {
      this.config.validate(config)
    }
    catch (error) {
      console.error(error.prettify ? error.prettify() : error) // eslint-disable-line
      process.exit(-1)
    }
    finally {
      console.info("Config is good, nice work.") // eslint-disable-line
    }
  }

  
}

module.exports = Multicolour
