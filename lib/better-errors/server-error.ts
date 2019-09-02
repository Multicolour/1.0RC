import PrettyErrorWithStack from "./pretty-error-with-stack"

class ServerError extends PrettyErrorWithStack {
  private error: string

  constructor(error: string) {
    super(error)

    this.error = error

    Error.captureStackTrace(this, ServerError)
  }

  public prettify() {
    return [
      this.error,
      "\n",
      this.getPrettyStack(),
      "\n",
      "Filtered out " +
        this.messageAST.framesDropped +
        " frames from frameworks and Node internals from the stack.",
    ].join("\n")
  }
}

export default ServerError
