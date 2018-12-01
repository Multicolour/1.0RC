// @flow

const PrettyErrorWithStack = require("./pretty-error-with-stack")

export type HttpError = {
  statusCode: number,
  message: string,
}

class HTTPError extends PrettyErrorWithStack {
  constructor(error: HttpError) {
    super("HTTP Error")
    
    this.statusCode = error.statusCode
    this.message = error.message

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
