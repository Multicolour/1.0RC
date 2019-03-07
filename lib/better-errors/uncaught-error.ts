import { Error$MessageAST } from "@types/error-ast"
import PrettyErrorWithStack from "./pretty-error-with-stack"

class UncaughtError extends PrettyErrorWithStack {
  originalErrorMessage: string
  validationErrors: Error[]
  messageAST: Error$MessageAST

  constructor(message: string, error: Error) {
    super(message)
    
    this.validationErrors = [error]
    this.stack = error.stack
    this.originalErrorMessage = error.message
    Error.captureStackTrace(this, UncaughtError)
  }

  prettify(): string {
    // @TODO: Add a filter that instructs where to add a try-catch/promise.
    const messages = [
      "ERROR: " + this.messageAST.message,
      "\n",
      "There was an uncaught error or a promise without a .catch. You should handle all errors and add new unit tests to test this eventuality..", // eslint-disable-line max-len
      "\n",
      `"${this.originalErrorMessage}"`,
      this.getPrettyStack(),
      "\n",
      "Filtered out " + this.messageAST.framesDropped + " frames from frameworks and Node internals from the stack.",
    ]
    
    return messages.join("\n")
  }
}

export default UncaughtError
