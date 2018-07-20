// @flow

import type { Config } from "@flow/multicolour/config.flow"

module.exports = function configValidator(config: Config) {
  const Ajv = require("ajv")
  const validator = new Ajv({
    allErrors: true,
  })

  // Our schemas.
  const configSchemas = require("./config-schemas")

  // Add the referenced schemas.
  Object.keys(configSchemas.refs)
    .forEach(name => validator.addSchema(configSchemas.refs[name], name))

  return {
    valid: validator.validate(configSchemas.configSchema, config),
    errors: validator.errors,
  }
}
