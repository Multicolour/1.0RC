import { Multicolour$Config } from "@mc-types/multicolour/config"
import Ajv from "ajv"
import { ConfigValidationError } from "../better-errors/better-errors"
import defaultConfig from "./default-config"

import apiConfigSchema from "../../schema/config/api-service.schema.json"
import configSchema from "../../schema/config/config.schema.json"
import databaseConfigSchema from "../../schema/config/database-service.schema.json"

function configValidator(config: Multicolour$Config): Multicolour$Config {
  const ajv = new Ajv()

  ajv
    .addSchema(apiConfigSchema)
    .addSchema(databaseConfigSchema)

  const target = {
    ...defaultConfig,
    ...config,
  }
  const valid = ajv.validate(configSchema, target)
console.log("VALID", valid)
  if (!valid) {
    throw new ConfigValidationError("Invalid configuration", ajv.errors || [])
  }

  return target
}

export default configValidator
