// @flow

const configSchema = require("../../../schema/config/config.schema.json")
const databaseConfigSchema = require("../../../schema/config/database-service.schema.json")
const apiConfigSchema = require("../../../schema/config/api-service.schema.json")

const jsonSchemaToFlow = require("./index")

function InternalSchemaToFlow() {
  const { resolve } = require("path")
  const ajv = new (require("ajv"))

  ajv
    .addSchema(apiConfigSchema)
    .addSchema(databaseConfigSchema)
    .compile(configSchema)

  jsonSchemaToFlow({
    AJV: ajv,
    typeName: "Config",
    destination: resolve("../../../", "flow/declarations/", "internal"),
  })
}

module.exports = InternalSchemaToFlow
