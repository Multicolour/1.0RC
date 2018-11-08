// @flow

const configSchema = require("../../schema/config/config.schema.json")
const databaseConfigSchema = require("../../schema/config/database-service.schema.json")
const apiConfigSchema = require("../../schema/config/api-service.schema.json")
const defaultConfig = require("./default-config")
const {
  ConfigValidationError,
  AJVSyntaxOrReferenceError,
} = require("../better-errors/better-errors")

import type { Multicolour$Config } from "../flow/declarations/multicolour/config.flow"

class Config {
  constructor() {
    this.ajv = new (require("ajv"))

    try {
      this.ajv
        .addSchema(apiConfigSchema)
        .addSchema(databaseConfigSchema)
    }
    catch (error) {
      console.error(new AJVSyntaxOrReferenceError("Syntax or reference error in schema", error).prettify())
      process.exit()
    }
  }

  validate(config: Multicolour$Config) {
    const target = {
      ...defaultConfig,
      ...config,
    }
    const valid = this.ajv.validate(configSchema, target)

    if (!valid)
      throw new ConfigValidationError("Invalid configuration", this.ajv.errors)

    return target
  }
}

module.exports = Config
