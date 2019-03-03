import PrettyErrorWithStack from "./pretty-error-with-stack"

export interface HttpErrorMessage {
  statusCode: number,
  headers?: object,
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

export default HttpError
