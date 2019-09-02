import PrettyErrorWithStack from "./pretty-error-with-stack"

class UncaughtError extends PrettyErrorWithStack {
  public originalErrorMessage: {} | null | undefined

  constructor(message: string, error: {} | null | undefined = {}) {
    super(message)

    this.originalErrorMessage = error
    Error.captureStackTrace(this, UncaughtError)
  }

  public prettify(): string {
    // @TODO: Add a filter that instructs where to add a try-catch/promise.
    const messages = [
      "ERROR: " + this.messageAST.message,
      "\n",
      // tslint:disable-next-line:max-line-length
      "There was an uncaught error or a promise without a .catch. You should handle all errors and add new unit tests to test this eventuality..",
      "\n",
      `"${this.originalErrorMessage}"`,
      this.getPrettyStack(),
      "\n",
      "Filtered out " +
        this.messageAST.framesDropped +
        " frames from frameworks and Node internals from the stack.",
    ]

    return messages.join("\n")
  }
}

export default UncaughtError
