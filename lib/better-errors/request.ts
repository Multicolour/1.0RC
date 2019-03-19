import PrettyErrorWithStack from "./pretty-error-with-stack"

class ClientRequestError extends PrettyErrorWithStack {
  private errors: Error

  constructor(error: Error) {
    super("Client request error")

    this.errors = error

    Error.captureStackTrace(this, ClientRequestError)
  }

  public prettify(): string {
    return this.errors.message
  }
}

export default ClientRequestError

