// @flow

"use strict"

const Ajv = require("ajv")

const schema = require("./schema/config.schema.json")
const data = require("./tests/content/config")

const ajv = new Ajv()

console.log(ajv.validate(schema, data))
