import { ErrorObject } from "ajv"

const PrettyErrorWithStack = require("./pretty-error-with-stack")

class AJVSyntaxOrReferenceError extends PrettyErrorWithStack {
  constructor(message: string, errors: ErrorObject[]) {
    super(message, "Schema syntax and relational checks")

    this.validationErrors = errors

    Error.captureStackTrace(this, AJVSyntaxOrReferenceError)
  }

  public prettify() {
    const messages = [
      "ERROR: " + this.messageAST.message,
      "\n",
      ...this.validationErrors.map((error: string, index: number) => `[${index}] * ${error}`),
      "\n",
      "There appears to be an issue with the provided schema and AJV is unable to compile them.",
      "This is most likely to be an internal problem or caused by editing your locally installed copy of Multicolour.",
      "Please submit a bug report at https://github.com/Multicolour/multicolour/issues/new",
      this.getPrettyStack(),
      "\n",
      "Filtered out " + this.messageAST.framesDropped + " frames from frameworks and Node internals from the stack.",
    ]

    return messages.join("\n")
  }
}

export default AJVSyntaxOrReferenceError
