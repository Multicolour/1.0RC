// @flow

import type { ErrorObject } from "ajv"

const AJVValidationError = require("./ajv-error")

class ModelValidationError extends AJVValidationError {
  constructor(message: string, ajvErrors: ErrorObject[] = []) {
    super(message, "model", ajvErrors)
  }
}

module.exports = ModelValidationError
