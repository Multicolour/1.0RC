// @flow

const configSchema = require("../../schema/config/config.schema.json")
const databaseConfigSchema = require("../../schema/config/database-service.schema.json")
const apiConfigSchema = require("../../schema/config/api-service.schema.json")
const defaultConfig = require("./default-config")
const { ConfigValidationError } = require("../better-errors/better-errors")

import type { Multicolour$Config } from "../../flow/declarations/multicolour/config.flow"

function configValidator(config: Multicolour$Config): Multicolour$Config {
  const ajv = new (require("ajv"))

  ajv
    .addSchema(apiConfigSchema)
    .addSchema(databaseConfigSchema)

  const target = {
    ...defaultConfig,
    ...config,
  }
  const valid = ajv.validate(configSchema, target)

  if (!valid)
    throw new ConfigValidationError("Invalid configuration", ajv.errors)
  
  return target
}

module.exports = configValidator
