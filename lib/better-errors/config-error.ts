// @flow

import type { ErrorObject } from "ajv"

const AJVValidationError = require("./ajv-error")

class ConfigValidationError extends AJVValidationError {
  constructor(message: string, ajvErrors: ErrorObject[] = []) {
    super(message, "config", ajvErrors)
  }
}

module.exports = ConfigValidationError
