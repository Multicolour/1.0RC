// @flow

const ConfigSchema = require("../schema/config.schema.json")
const { ConfigValidationError } = require("./better-errors/better-errors")

import type { Multicolour$Config } from "../flow/declarations/multicolour/config.flow"

class Config {
  constructor(config: Multicolour$Config) {
    const Ajv = require("ajv")
    const ajv = new Ajv()

    const valid = ajv.validate(ConfigSchema, config)

    if (!valid)
      throw new ConfigValidationError("Invalid configuration", ajv.errors)

    return config
  }
}

module.exports = Config
