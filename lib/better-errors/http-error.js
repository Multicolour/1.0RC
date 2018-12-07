// @flow

const PrettyErrorWithStack = require("./pretty-error-with-stack")

export type HttpError = {
  statusCode: number,
  headers?: Object,
  error: {
    message: string,
  },
}

class HTTPError extends PrettyErrorWithStack {
  statusCode: number

  constructor(error: HttpError) {
    super(error.error.message)
    
    this.statusCode = error.statusCode

    Error.captureStackTrace(this, HTTPError)
  }

  prettify() {
    return [
      this.statusCode,
      this.message,
    ].join("\n")
  }

}

module.exports = HTTPError
