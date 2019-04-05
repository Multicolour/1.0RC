import PrettyErrorWithStack from "./pretty-error-with-stack"

class RouterError extends PrettyErrorWithStack {
  constructor(error: Error) {
    super(error.message)

    Error.captureStackTrace(this, RouterError)
  }
}

export default RouterError

