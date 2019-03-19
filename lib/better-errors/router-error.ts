import PrettyErrorWithStack from "./pretty-error-with-stack"

class RouterError extends PrettyErrorWithStack {
  private errors: Error

  constructor(error: Error) {
    super("Routing error")

    this.errors = error

    Error.captureStackTrace(this, RouterError)
  }

  public prettify(): string {
    return this.errors.message
  }
}

export default RouterError

