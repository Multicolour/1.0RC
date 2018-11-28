// @flow

const PrettyErrorWithStack = require("./pretty-error-with-stack")

class RouterError extends PrettyErrorWithStack {
  constructor(message: string, error: Error) {
    super(message, "Routing error")

    this.errors = error

    Error.captureStackTrace(this, RouterError)
  }

  prettify(): string {
    return this.errors.message
  }
}

module.exports = RouterError

