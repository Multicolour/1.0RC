import { ErrorObject } from "ajv"

import AJVValidationError from "./ajv-error"

class ModelValidationError extends AJVValidationError {
  constructor(message: string, ajvErrors: ErrorObject[] = []) {
    super(message, "model", ajvErrors)
  }
}

export default ModelValidationError
