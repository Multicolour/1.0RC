// @flow

const PrettyErrorWithStack = require("./pretty-error-with-stack")

export type HttpErrorMessage = {
  statusCode: number,
  headers?: Object,
  error: {
    message: string,
  },
}

class HttpError extends PrettyErrorWithStack {
  statusCode: number

  constructor(error: HttpErrorMessage) {
    super(error.error.message)
    
    this.statusCode = error.statusCode

    Error.captureStackTrace(this, HttpError)
  }

  prettify() {
    return [
      this.statusCode,
      this.message,
    ].join("\n")
  }

}

module.exports = HttpError
