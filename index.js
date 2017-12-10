// @flow
const Ajv = require("ajv")

const schema = require("./schema/config.schema.json")
const data = require("./tests/content/config")

const ajv = new Ajv()
const valid = ajv.validate(schema, data)
console.log(valid, ajv.errors)
