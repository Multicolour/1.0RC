import PrettyErrorWithStack from "./pretty-error-with-stack"

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

export default RouterError

