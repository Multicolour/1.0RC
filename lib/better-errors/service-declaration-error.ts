import { Multicolour$ServiceDeclarationError } from "@mc-types/multicolour/service-declaration-error"

import PrettyErrorWithStack from "./pretty-error-with-stack"

class ServiceDeclarationError extends PrettyErrorWithStack {
  private validationErrors: Multicolour$ServiceDeclarationError[]

  constructor(
    message: string,
    errors: Multicolour$ServiceDeclarationError[] = [],
  ) {
    super(message, "Service declaration error")

    this.validationErrors = errors

    Error.captureStackTrace(this, ServiceDeclarationError)
  }

  public prettify(): string {
    const validationErrors = this.getErrors()

    const messages = [
      "ERROR: " + this.messageAST.message,
      "\n",
      "Encountered the following validation errors:",
      ...validationErrors.map(
        (error: string, index: number) => `[${index}] * ${error}`,
      ),
      "\n",
      "Validation errors in your config are preventing Multicolour from starting up safely.",
      // tslint:disable-next-line:max-line-length
      "Please review the error above, frame stack below and perhaps visit the documentation https://getmulticolour.com/docs/1.0/config to help fix this issue.",
      this.getPrettyStack(),
      "\n",
      "Filtered out " +
        this.messageAST.framesDropped +
        " frames from frameworks and Node internals from the stack.",
    ]

    return messages.join("\n")
  }

  private getErrors(): string[] {
    return this.validationErrors.reduce(
      (
        neatErrors: string[],
        currentError: Multicolour$ServiceDeclarationError,
      ): string[] => {
        switch (currentError.type) {
          case "dependency-missing":
            neatErrors.push(currentError.message)
            break
          default:
            neatErrors.push(
              "Couldn't make this message more user friendly. Here it is raw:",
            )
            neatErrors.push(
              JSON.stringify(currentError, null, 2)
                .split("\n")
                .map((part: string) => `\t${part}`)
                .join("\n"),
            )
        }

        return neatErrors
      },
      [],
    )
  }
}

export default ServiceDeclarationError
