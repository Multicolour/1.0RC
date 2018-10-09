// @flow

const PrettyErrorWithStack = require("./pretty-error-with-stack")

class UncaughtError extends PrettyErrorWithStack {
  constructor(message: string, error: Error) {
    super(message)
    
    this.validationErrors = error
    this.stack = error.stack
    this.name = error.name
    this.originalErrorMessage = error.message
    this.messageAST = this.getMessageAst()
  }

  prettify(): string {
    const messages = [
      "ERROR: " + this.messageAST.message,
      "\n",
      "There was an uncaught error or a promise without a .catch. You should handle all errors and add new unit tests to test this eventuality..",
      "\n",
      `"${this.originalErrorMessage}"`,
      this.getPrettyStack(),
      "\n",
      "Filtered out " + this.messageAST.framesDropped + " frames from frameworks and Node internals from the stack.",
    ]
    
    return messages.join("\n")
  }
}

module.exports = UncaughtError