// @flow

import type { ErrorObject } from "ajv"

const PrettyErrorWithStack = require("./pretty-error-with-stack")

class ConfigValidationError extends PrettyErrorWithStack {
  constructor(message: string, errors: ErrorObject[] = []) {
    super(message, "Config objects validation against JSON schema.")
    
    this.validationErrors = errors

    Error.captureStackTrace(this, ConfigValidationError)
  }

  getValidationErrorsFromAJVAST(): string[] {
    return this.validationErrors.reduce((neatErrors: string[], currentError: ErrorObject): string[] => {
      switch (currentError.keyword) {
      case "required":
        neatErrors.push(`Property "config${currentError.dataPath || ""}" requires the presence of "${currentError.params.missingProperty}".`) // eslint-disable-line max-len
        break
      case "minProperties":
        neatErrors.push(`Property "config${currentError.dataPath}" requires at least '${currentError.params.limit}' defined properties`) // eslint-disable-line max-len

        break
      case "enum":
        neatErrors.push(`Property "config${currentError.dataPath}" has an incorrect value, expected a value matching one of '${currentError.params.allowedValues.join("', '")}'`) // eslint-disable-line max-len

        break
      case "additionalProperties":
        // @TODO: Add common typo LUT for each property to offer some answers. 
        neatErrors.push(`Data path config${currentError.dataPath} shouldn't have the property "${currentError.params.additionalProperty}". Maybe you misspelled the propery? Check your service's configuration.`) // eslint-disable-line max-len

        break
      /* istanbul ignore next */
      default:
        neatErrors.push("Couldn't make this message more user friendly. Here it is raw:")
        neatErrors.push(JSON.stringify(currentError, null, 2).split("\n").map((part: string) => `\t${part}`).join("\n"))
      }

      return neatErrors
    }, [])
  }

  prettify(): string {
    const validationErrors = this.getValidationErrorsFromAJVAST()

    const messages = [
      "ERROR: " + this.messageAST.message,
      "\n",
      "Encountered the following validation errors:",
      ...validationErrors.map((error: string, index: number) => `[${index}] * ${error}`),
      "\n",
      "Validation errors in your config are preventing Multicolour from starting up safely.",
      "Please review the error above, frame stack below and perhaps visit the documentation https://getmulticolour.com/docs/1.0/config to help fix this issue.", // eslint-disable-line max-len
      this.getPrettyStack(),
      "\n",
      "Filtered out " + this.messageAST.framesDropped + " frames from frameworks and Node internals from the stack.",
    ]
    
    return messages.join("\n")
  }
}

module.exports = ConfigValidationError
