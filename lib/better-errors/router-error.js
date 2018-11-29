// @flow

const PrettyErrorWithStack = require("./pretty-error-with-stack")

class RouterError extends PrettyErrorWithStack {
  constructor(error: Error) {
    super("Routing error")

    this.errors = error

    Error.captureStackTrace(this, RouterError)
  }

  prettify(): string {
    return this.errors.message
  }
}

module.exports = RouterError

