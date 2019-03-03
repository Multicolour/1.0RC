// @flow

const PrettyErrorWithStack = require("./pretty-error-with-stack")

class ClientRequestError extends PrettyErrorWithStack {
  constructor(error: Error) {
    super("Client request error")

    this.errors = error

    Error.captureStackTrace(this, ClientRequestError)
  }

  prettify(): string {
    return this.errors.message
  }
}

module.exports = ClientRequestError

