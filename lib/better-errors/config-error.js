// @flow

const PrettyErrorWithStack = require("./pretty-error-with-stack")

class ConfigValidationError extends PrettyErrorWithStack {
  constructor(message: string, errors: ajv.ErrorObject[] = []) {
    super(message, "Config objects validation against JSON schema.")
    
    this.validationErrors = errors

    Error.captureStackTrace(this, ConfigValidationError)
  }

  getValidationErrorsFromAJVAST(): string[] {
    return this.validationErrors.reduce((neatErrors: string[], currentError: ajv.ErrorObject): string[] => {
      switch (currentError.keyword) {
      case "required":
        currentError.dataPath && neatErrors.push(`Property "config${currentError.dataPath}" requires the presence of "${currentError.params.missingProperty}".`)
        break
      case "minProperties":
        neatErrors.push(`Property "config${currentError.dataPath}" requires at least '${currentError.params.limit}' defined property.`)
        break
      case "enum":
        neatErrors.push(`Property "config${currentError.dataPath}" has an incorrect value, expected a value matching one of '${currentError.params.allowedValues.join("', '")}'`)
        break
      case "anyOf":
      case "additionalProperties":
        // @TODO: This might be useful some day. It's needlessly confusing right now.
        break
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
      "Encountered the following validation errors",
      ...validationErrors.map((error: string) => ` * ${error}`),
      "\n",
      "Validation errors in your config are preventing Multicolour from starting up safely.",
      "Please review the stack above and perhaps visit the documentation https://getmulticolour.com/docs/1.0/config",
      this.getPrettyStack(),
      "\n",
      "Filtered out " + this.messageAST.framesDropped + " frames from frameworks and Node internals from the stack.",
    ]
    
    return messages.join("\n")
  }
}

module.exports = ConfigValidationError
