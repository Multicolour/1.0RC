// @flow

const Config = require("./lib/config")

import type { Multicolour$Config } from "./flow/declarations/multicolour/config.flow"

Error.stackTraceLimit = Infinity

class Multicolour {
  constructor(config: Multicolour$Config) {
    try {
      this.config = new Config(config)
    }
    catch (error) {
      console.error(error.prettify())
    }
  }
}

module.exports = Multicolour