import {
  AdditionalPropertiesParams,
  EnumParams,
  ErrorObject,
  LimitParams,
  RequiredParams,
} from "ajv"

import PrettyErrorWithStack from "./pretty-error-with-stack"

class AJVValidationError extends PrettyErrorWithStack {
  public object: string
  public validationErrors: ErrorObject[]

  constructor(message: string, object: string, errors: ErrorObject[] = []) {
    super(message, `${object} objects validation against JSON schema.`)

    this.object = object

    this.validationErrors = errors

    Error.captureStackTrace(this, AJVValidationError)
  }

  public getValidationErrorsFromAJVAST(): string[] {
    return this.validationErrors.reduce((neatErrors: string[], currentError: ErrorObject): string[] => {
      switch (currentError.keyword) {
      case "required":
        neatErrors.push(`Property "${this.object}${currentError.dataPath || ""}" requires the presence of "${(currentError.params as RequiredParams).missingProperty}".`) // eslint-disable-line max-len
        break
      case "minProperties":
        neatErrors.push(`Property "${this.object}${currentError.dataPath}" requires at least '${(currentError.params as LimitParams).limit}' defined properties`) // eslint-disable-line max-len

        break
      case "enum":
        neatErrors.push(`Property "${this.object}${currentError.dataPath}" has an incorrect value, expected a value matching one of '${(currentError.params as EnumParams).allowedValues.join("', '")}'`) // eslint-disable-line max-len

        break
      case "additionalProperties":
        // @TODO: Add common typo LUT for each property to offer some answers.
        neatErrors.push(`Data path ${this.object}${currentError.dataPath} shouldn't have the property "${(currentError.params as AdditionalPropertiesParams).additionalProperty}". Maybe you misspelled the propery? Check your service's configuration.`) // eslint-disable-line max-len

        break
      /* istanbul ignore next */
      default:
        neatErrors.push("Couldn't make this message more user friendly. Here it is raw:")
        neatErrors.push(JSON.stringify(currentError, null, 2).split("\n").map((part: string) => `\t${part}`).join("\n"))
      }

      return neatErrors
    }, [])
  }

  public prettify(): string {
    const validationErrors = this.getValidationErrorsFromAJVAST()

    const messages = [
      "ERROR: " + this.messageAST.message,
      "\n",
      "Encountered the following validation errors:",
      ...validationErrors.map((error: string, index: number) => `[${index}] * ${error}`),
      "\n",
      `Validation errors in your ${this.object} are preventing Multicolour from starting up safely.`,
      "Please review the error above, frame stack below and perhaps visit the documentation https://getmulticolour.com/docs/1.0/config to help fix this issue.", // eslint-disable-line max-len
      this.getPrettyStack(),
      "\n",
      "Filtered out " + this.messageAST.framesDropped + " frames from frameworks and Node internals from the stack.",
    ]

    return messages.join("\n")
  }
}

export default AJVValidationError
