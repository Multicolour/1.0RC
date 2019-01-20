// @flow

const configSchema = require("../../schema/config/config.schema.json")
const databaseConfigSchema = require("../../schema/config/database-service.schema.json")
const apiConfigSchema = require("../../schema/config/api-service.schema.json")
const defaultConfig = require("./default-config")
const {
  ConfigValidationError,
  AJVSyntaxOrReferenceError,
} = require("../better-errors/better-errors")

import type { Multicolour$Config } from "../../flow/declarations/multicolour/config.flow"

function configValidator(config: Multicolour$Config): Multicolour$Config {
  const ajv = new (require("ajv"))

  try {
    ajv
      .addSchema(apiConfigSchema)
      .addSchema(databaseConfigSchema)
  }
  catch (error) {
    /* istanbul ignore next */
    console.error(new AJVSyntaxOrReferenceError("Syntax or reference error in schema", error).prettify()) // eslint-disable-line no-console
    /* istanbul ignore next */
    process.exit()
  }

  const target = {
    ...defaultConfig,
    ...config,
  }
  const valid = ajv.validate(configSchema, target)

  if (!valid)
    throw new ConfigValidationError("Invalid configuration", ajv.errors)
  console.log(Object.values(ajv._schema).filter(Boolean).map(({ schema }) => schema))
  return target
}

module.exports = configValidator
