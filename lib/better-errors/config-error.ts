import { ErrorObject } from "ajv"

import AJVValidationError from "./ajv-error"

class ConfigValidationError extends AJVValidationError {
  constructor(message: string, ajvErrors: ErrorObject[] = []) {
    super(message, "config", ajvErrors)
  }
}

export default ConfigValidationError
