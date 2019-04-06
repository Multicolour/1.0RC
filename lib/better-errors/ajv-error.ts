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
  protected validationErrors: ErrorObject[]

  constructor(message: string, object: string, validationErrors: ErrorObject[] = []) {
    super(message, `${object} objects validation against JSON schema failed.`)

    this.object = object
    this.validationErrors = validationErrors

    Error.captureStackTrace(this, AJVValidationError)
  }

  public prettify(): string {
    const validationErrors = this.getValidationErrorsFromAJVAST()
    const messageAST = this.getMessageAst()

    const messages = [
      "ERROR: " + messageAST.message,
      "\n",
      "Encountered the following validation errors:",
      ...validationErrors.map((error: string, index: number) => `[${index}] * ${error}`),
      "\n",
      `Validation errors in your ${this.object} are preventing Multicolour from starting up safely.`,
        // tslint:disable-next-line:max-line-length
      "Please review the error above, frame stack below and perhaps visit the documentation https://getmulticolour.com/docs/1.0/config to help fix this issue.",
      this.getPrettyStack(),
      "\n",
      "Filtered out " + messageAST.framesDropped + " frames from frameworks and Node internals from the stack.",
    ]

    return messages.join("\n")
  }

  private getValidationErrorsFromAJVAST(): string[] {
    return this.validationErrors.reduce((neatErrors: string[], currentError: ErrorObject): string[] => {
      switch (currentError.keyword) {
      case "required":
        // tslint:disable-next-line:max-line-length
        neatErrors.push(`Property "${this.object}${currentError.dataPath || ""}" requires the presence of "${(currentError.params as RequiredParams).missingProperty}".`)
        break
      case "minProperties":
        // tslint:disable-next-line:max-line-length
        neatErrors.push(`Property "${this.object}${currentError.dataPath}" requires at least '${(currentError.params as LimitParams).limit}' defined properties`)
        break
      case "enum":
        // tslint:disable-next-line:max-line-length
        neatErrors.push(`Property "${this.object}${currentError.dataPath}" has an incorrect value, expected a value matching one of '${(currentError.params as EnumParams).allowedValues.join("', '")}'`)

        break
      case "additionalProperties":
        // @TODO: Add common typo LUT for each property to offer some answers.
        // tslint:disable-next-line:max-line-length
        neatErrors.push(`Data path ${this.object}${currentError.dataPath} shouldn't have the property "${(currentError.params as AdditionalPropertiesParams).additionalProperty}". Maybe you misspelled the propery? Check your service's configuration.`)

        break
      /* istanbul ignore next */
      default:
        neatErrors.push("Couldn't make this message more user friendly. Here it is raw, sorry about that:")
        neatErrors.push(JSON.stringify(currentError, null, 2).split("\n").map((part: string) => `\t${part}`).join("\n"))
      }

      return neatErrors
    }, [])
  }

}

export default AJVValidationError
