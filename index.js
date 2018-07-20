// @flow

Error.stackTraceLimit = Infinity

const configValidator = require("./lib/config/config-validator")
const configObject = require("./config")

const validation = configValidator(configObject)

console.log(validation)

