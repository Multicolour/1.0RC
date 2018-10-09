// @flow

const PrettyErrorWithStack = require("./pretty-error-with-stack")

class HTTPError extends PrettyErrorWithStack {
  constructor(message: string, errors: Error[] = []) {
    super(message)
    
    this.validationErrors = errors

    Error.captureStackTrace(this, HTTPError)
  }

}

module.exports = HTTPError