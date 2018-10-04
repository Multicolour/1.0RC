// @flow

const PrettyErrorWithStack = require("./pretty-error-with-stack")

export type NeatValidationErrors = {
  [key: string]: string,
}

class ConfigValidationError extends PrettyErrorWithStack {
  constructor(message: string, errors: ajv.ErrorObject[]) {
    super(message)
    
    this.name = this.constructor.name
    this.validationErrors = errors

    Error.captureStackTrace(this, ConfigValidationError)
  }

  prettify(): string {
    const messageAST = this.getMessageAst()
    const validationErrors = this.validationErrors.reduce((neatErrors: NeatValidationErrors, currentError: ajv.ErrorObject): NeatValidationErrors => {
      neatErrors[currentError.dataPath || "required"] = [currentError.message.toUpperCase()[0] + currentError.message.slice(1)]
      return neatErrors
    }, {})
    const messages = [
      "ERROR: " + messageAST.message,
      "\n",
      JSON.stringify(validationErrors, null, 2),
      "\n",
      "Validation errors in your config are preventing Multicolour from starting up safely.",
      "Please review the stack above and perhaps visit the documentation https://getmulticolour.com/docs/1.0/config",
      messageAST.stack.map((frame: Error$MessageFrameAST, index: number) => {
        let contextLanguage = "then"
        
        if (index === 0)
          contextLanguage = "error created at"

        return [
          "\n",
          contextLanguage,
          " * call: " + frame.caller,
          " * in: " + frame.file,
          " * line: " + frame.line,
          " * column: " + frame.column,
        ].join("\n")
      }),
      "\n",
      "Filtered out " + messageAST.framesDropped + " frames from the stack.",
    ]
    
    return messages.join("\n")
  }
}

module.exports = ConfigValidationError
